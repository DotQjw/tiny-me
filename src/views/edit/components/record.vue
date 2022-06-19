<template>
  <el-dialog
    :title="title"
    center
    :visible.sync="show"
    width="300px"
    :before-close="handleClose"
    :close-on-click-modal="false"
  >
    <div class="dialog-main">
      <div>录音过程中请保持环境安静无其他噪音</div>
      <div>单次建议最多录制十分钟</div>
      <div v-if="recordType === 'ready'" class="unready">未开始</div>
      <div v-if="recordType === 'recording'" class="recording">
        已录制：{{ recordTime }}秒
      </div>
      <div style="color: grey" v-if="showTip">{{ overTimeTip }}</div>
      <div v-if="percentage != 0">
        <div style="text-align: center; margin-top: 10px">录音转文字中</div>
        <el-progress
          :text-inside="true"
          :stroke-width="16"
          :percentage="percentage"
        ></el-progress>
      </div>
      <div class="dialog-btn">
        <el-button
          type="primary"
          v-if="recordType === 'ready'"
          @click="startRecord"
          >准备好了，开始录制</el-button
        >
        <el-button
          type="primary"
          v-if="recordType === 'recording'"
          @click="stopRecord"
          >完成录制</el-button
        >
        <el-button
          type="primary"
          v-if="recordType === 'uploadFail'"
          @click="stopRecord"
          >重新上传</el-button
        >
        <el-button
          type="primary"
          :loading="btnLoading"
          v-if="recordType === 'uploadRecord'"
          >录音上传中</el-button
        >
        <el-button
          type="text"
          v-if="recordType === 'recording'"
          @click="handleCancel"
          >取消</el-button
        >
        <el-button
          type="primary"
          :loading="btnLoading"
          v-if="recordType === 'uploadSuccess'"
          @click="startRecord"
          >录制新音频</el-button
        >
        <el-button
          type="text"
          v-if="recordType === 'uploadSuccess'"
          @click="changeText"
          >转文字</el-button
        >
      </div>
      <!-- <audio  :src="src" controls></audio> -->
    </div>
  </el-dialog>
</template>
<script>
import Recorder from "js-audio-recorder";
import lamejs from "lamejs";
import { uploadAudio } from "@/api/upload";
import { audioToText } from "@/api/table";
import { baseUrl } from "@/utils/baseUrl";
export default {
  props: {
    type: {
      type: String,
      default: "",
    },
    maxIndex: {
      type: Number,
      default: 1,
    },
    show: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      isChange: false,
      audioUrl: "",
      percentage: 0,
      overTimeTip: "即将超过10分钟",
      showTip: false,
      maxLenght: this.maxIndex,
      fisrtTips: true,
      title: "准备录制",
      src: "",
      fileList: [],
      recorder: null,
      videoSrc: "",
      recordType: "ready",
      recordTime: null,
      timer: null,
      changeTimer:null,
      btnLoading: false,
      src: "",
    };
  },
  created() {
    console.log("this.type", this.type);
    if (navigator.mediaDevices.getUserMedia) {
      const constraints = { audio: true };
      navigator.mediaDevices.getUserMedia(constraints).then(
        (stream) => {
          console.log("授权成功！");
        },
        (err) => {
          console.error("授权失败！");
        }
      );
    } else {
      console.error("浏览器不支持 getUserMedia");
    }
    this.recorder = new Recorder({
      sampleBits: 16, // 采样位数，支持 8 或 16，默认是16
      sampleRate: 16000, // 采样率，支持 11025、16000、22050、24000、44100、48000，根据浏览器默认值，我的chrome是48000
      numChannels: 1, // 声道，支持 1 或 2， 默认是1
      // compiling: false,(0.x版本中生效,1.x增加中)  // 是否边录边转换，默认是false
    });
  },
  beforeDestroy() {
    clearInterval(this.timer);
  },
  methods: {
    async changeText() {
      console.log('转文字')
      if (this.isChange) {
        return;
      }
      this.isChange = true;
      this.percentage = 0;
      this.changeTimer = setInterval(() => {
        this.percentage += 1;
        if (this.percentage === 95) {
          clearInterval(this.changeTimer);
        }
      }, 100);
      const res = await audioToText({ url: this.audioUrl });
      this.isChange = false;
      if (res.data && res.data.text) {
        // this.$message.success("录音转文字成功");
        this.copyText = res.data.text;
        clearInterval(this.changeTimer);
        this.percentage = 0;
        this.$nextTick(() => {
          this.copyData();
        });
      }
    },
    copyData(type) {
      this.$copyText(this.copyText).then(
        (e) => {
          this.$nextTick(()=>{
            this.copyDataAgain();
          })
          // this.$message.success("现在点附件里的转文字已经有了，直接复用");
        },
        (e) => {
          this.$message.success("复制失败,请重试");
        }
      );
    },
    copyDataAgain() {
      this.$copyText(this.copyText).then(
        (e) => {
          this.$message.success("现在点附件里的转文字已经有了，直接复用");
        },
        (e) => {
          this.$message.success("复制失败,请重试");
        }
      );
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
            if (this.recordTime == 540 && this.fisrtTips) {
              this.fisrtTips = false;
              this.showTip = true;
              this.overTimeTip = "即将超过10分钟";
            }
          }, 1000);
        },
        (error) => {
          // 出错了
          if (error.message.includes("Requested device not found")) {
            this.$message.error("未检查到您的麦克风设备，请检查");
          }
          console.log(`${error.name} : ${error.message}`);
        }
      );
    },
    stopRecord() {
      console.log("token", this.$store.getters.token);
      this.recorder.stop();
      this.title = "录制结束";
      this.recordType = "uploadRecord";
      clearInterval(this.timer);
      const wavData = this.recorder.getWAVBlob();
      const data = new FormData();
      let file = new File([wavData], "custom.wav");
      data.append("file", file);
      console.log("fileSize", this.recorder.fileSize);
      this.btnLoading = true;
      console.log("this.recorder.duration", this.recorder.duration);
      uploadAudio(data)
        .then((res) => {
          console.log("res", res);
          this.src = baseUrl() + res.data.url;
          this.audioUrl = res.data.url;
          this.$message.success("录音上传成功");
          this.btnLoading = false;
          this.recordType = "uploadSuccess";
          this.$emit("uploadRecord", {
            name: `录音${this.maxLenght}`,
            url: res.data.url,
            size: this.recorder.fileSize,
            duration: parseInt(this.recorder.duration),
          });
          this.maxLenght += 1;
        })
        .catch((err) => {
          console.log("err", err);
          this.$message.error("录音上传失败，请重新上传");
          this.btnLoading = false;
          this.recordType = "uploadFail";
        });
    },
    handleCancel() {
      this.$confirm("确定要取消录音吗", "提示", {
        confirmButtonText: "继续录音",
        cancelButtonText: "取消录音",
        type: "warning",
      })
        .then(() => {})
        .catch((_) => {
          clearInterval(this.timer);
          this.recorder.stop();
          this.title = "录制结束";
          this.recordType = "ready";
        });
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
  color: #165dff;
  font-weight: bold;
}
</style>
