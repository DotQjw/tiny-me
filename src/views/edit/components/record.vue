<template>
  <el-dialog
    :title="title"
    center
    :visible.sync="show"
    width="300px"
    :before-close="handleClose"
  >
    <div class="dialog-main">
      <div>录音过程中请保持环境安静无其他噪音</div>
      <div>单次建议最多录制十分钟</div>
      <div v-if="recordType !== 'recording'" class="unready">未开始</div>
      <div v-if="recordType === 'recording'" class="recording">
        已录制：{{ recordTime }}秒
      </div>
      <div class="dialog-btn">
        <el-button
          type="success"
          v-if="recordType !== 'recording'"
          @click="startRecord"
          >准备好了，开始录制</el-button
        >
        <el-button
          type="primary"
          v-if="recordType === 'recording'"
          @click="stopRecord"
          >完成录制</el-button
        >
        <!-- <el-button
          type="primary"
          v-if="recordType === 'recording'"
          @click="getBlob"
          >暂停获取数据</el-button
        > -->
        <el-button
          type="text"
          v-if="recordType === 'recording'"
          @click="startRecord"
          >取消</el-button
        >
      </div>
    </div>
  </el-dialog>
</template>
<script>
import Recorder from "js-audio-recorder";
import lamejs from "lamejs";
import { uploadAudio } from "@/api/upload";
export default {
  props: {
    type: {
      type: Number,
      default: null,
    },
    show: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      title: "准备录制",
      src: "",
      fileList: [],
      recorder: null,
      videoSrc: "",
      recordType: "ready",
      recordTime: null,
      timer: null,
    };
  },
  created() {
    console.log("this.type", this.type);
    this.recorder = new Recorder({
      sampleBits: 16, // 采样位数，支持 8 或 16，默认是16
      sampleRate: 16000, // 采样率，支持 11025、16000、22050、24000、44100、48000，根据浏览器默认值，我的chrome是48000
      numChannels: 1, // 声道，支持 1 或 2， 默认是1
      // compiling: false,(0.x版本中生效,1.x增加中)  // 是否边录边转换，默认是false
    });
  },
  methods: {
    beforeRemove(file) {},
    handlePreview(file) {},
    handleRemove(file) {},
    handleSuccess(response, file, fileList) {
      console.log("handleSuccess", { response, file, fileList });
    },
    handleExceed(file) {
      console.log("handleExceed", file);
    },
    handleClose() {
      this.$emit("update:show", false);
    },
    startRecord() {
      this.recorder.start().then(
        () => {
          // 开始录音
          this.title = "录制中";
          this.recordType = "recording";
          this.recordTime = 0;
          this.timer = setInterval(() => {
            this.recordTime++;
          }, 1000);
        },
        (error) => {
          // 出错了
          console.log(`${error.name} : ${error.message}`);
        }
      );
    },
    stopRecord() {
      var that = this;
      this.recorder.stop();
      this.title = "录制结束";
      this.recordType = "stopRecord";
      clearInterval(this.timer);
      const wavData = this.recorder.getWAVBlob();
      const data = new FormData();
      let file = new File([wavData], "custom.wav");
      data.append("file", file);
      uploadAudio(data).then((res) => {
        this.$message.success("录音上传成功");
      });
      // that.play();
    },
    getBlob() {},
    play() {
      // this.recorder.play();
      // getWholeData()
      // this.recorder.onprogress = function (params) {
      //   console.log("录音时长(秒)", params.duration);
      //   console.log("录音大小(字节)", params.fileSize);
      //   console.log("录音音量百分比(%)", params.vol);
      //   // console.log('当前录音的总数据([DataView, DataView...])', params.data);
      // };
      const blobs = this.recorder.getPCMBlob();
      // const dataBlob = this.changeMp3()
      let file = this.changeMp3(this.recorder.getWAV());
      console.log("dataBlob", file);
      var audio = document.createElement("audio");
      this.src = URL.createObjectURL(file);
      return;
      audio.src = URL.createObjectURL(file);
      var box = document.getElementById("box");
      audio.controls = true;
      box.appendChild(audio);
      // this.recorder.getPCMBlob();
      // console.log("URL.createObjectURL(blob)", URL.createObjectURL(blobs));
      // let dataArray = this.recorder.getRecordAnalyseData();
      // console.log("dataArray", dataArray);
      // setTimeout(() => {
      //   var audio = document.createElement("audio");
      //   audio.src = URL.createObjectURL(blobs);
      //   var box = document.getElementById("box");
      //   audio.controls = true;
      //   box.appendChild(audio);
      // }, 5000);
    },
    changeMp3(wavDataView = {}) {
      // 获取wav头信息
      const wav = lamejs.WavHeader.readHeader(wavDataView); // 此处其实可以不用去读wav头信息，毕竟有对应的config配置
      const { channels, sampleRate } = wav;
      // const sampleRate = 16000;
      // const channels = 1
      const mp3enc = new lamejs.Mp3Encoder(channels, sampleRate, 128);
      // 获取左右通道数据
      const result = this.recorder.getChannelData();
      console.log("result", result);
      const buffer = [];

      const leftData =
        result.left &&
        new Int16Array(result.left.buffer, 0, result.left.byteLength / 2);
      const rightData =
        result.right &&
        new Int16Array(result.right.buffer, 0, result.right.byteLength / 2);
      const remaining = leftData.length + (rightData ? rightData.length : 0);

      const maxSamples = 1152;
      for (let i = 0; i < remaining; i += maxSamples) {
        const left = leftData.subarray(i, i + maxSamples);
        let right = null;
        let mp3buf = null;

        if (channels === 2) {
          right = rightData.subarray(i, i + maxSamples);
          mp3buf = mp3enc.encodeBuffer(left, right);
        } else {
          mp3buf = mp3enc.encodeBuffer(left);
        }

        if (mp3buf.length > 0) {
          buffer.push(mp3buf);
        }
      }

      const enc = mp3enc.flush();

      if (enc.length > 0) {
        buffer.push(enc);
      }

      return new Blob(buffer, { type: "audio/mp3" });
    },
  },
};
</script>
<style lang="scss" scoped>
.dialog-main {
  line-height: 30px;
}
.dialog-btn {
  margin-top: 20px;
  margin-bottom: 20px;
  text-align: center;
}
.unready {
  color: gray;
}
.recording {
  color: #67c23a;
}
</style>
