<template>
  <div class="upload"></div>
</template>

<script>
import "../assets/webuploader.js";
import service from "@/utils/service";
export default {
  name: "vue-upload",
  props: {
    accept: {
      type: String,
      default: null
    },
    // 上传地址
    url: {
      type: String,
      default: ""
    },
    // 上传最大数量 默认为100
    fileNumLimit: {
      type: Number,
      default: 100
    },
    // 大小限制 默认2M
    fileSingleSizeLimit: {
      type: Number,
      default: 2048000
    },
    // 上传时传给后端的参数，一般为token，key等
    formData: {
      type: Object,
      default: null
    },
    // 生成formData中文件的key，下面只是个例子，具体哪种形式和后端商议
    keyGenerator: {
      type: Function,
      default(file) {
        const currentTime = new Date().getTime();
        const key = `${currentTime}.${file.name}`;
        return key;
      }
    },
    multiple: {
      type: Boolean,
      default: false
    },
    // 上传按钮ID
    uploadButton: {
      type: String,
      default: ""
    }
  },
  data() {
    return {
      uploader: null,
      data1: {},
      service: service
    };
  },
  mounted() {
    console.log(WebUploader)
    this.initWebUpload();
    
  },
  destroyed() {
    console.log("destro");
  },
  methods: {
    initWebUpload() {
      const $this = this;
      if (!WebUploader.Uploader.support()) {
        alert(
          "Web Uploader 不支持您的浏览器！如果你使用的是IE浏览器，请尝试升级 flash 播放器"
        );
        throw new Error(
          "WebUploader does not support the browser you are using."
        );
      }
      // md5 文件加密
      WebUploader.Uploader.register(
        {
          "before-send-file": "beforeSendFile",
          "before-send": "beforeSend"
        },
        {
          beforeSendFile: function(file) {
            // Deferred对象在钩子回掉函数中经常要用到，用来处理需要等待的异步操作。
            var task = new $.Deferred();
            // 根据文件内容来查询MD5
            $this.uploader
              .md5File(file)
              .progress(function(percentage) {
                // 及时显示进度
                //getProgressBar(file, percentage, "MD5", "MD5");
                $(`.file-${file.id} .progress`).css(
                  "width",
                  percentage * 100 + "%"
                );
                $(`.file-${file.id} .file-status`).html(
                  (percentage * 100).toFixed(2) + "%"
                );
                return $.when(task);
              })
              .then(function(val) {
                // 完成
                file.md5 = val;

                // 模拟用户id
                // file.uid = new Date().getTime() + "_" + Math.random() * 100;
                file.uid = WebUploader.Base.guid();

                // 进行md5判断
                $.post(
                  $this.service.upload + "/index/checkFileMd5",
                  { uid: file.uid, md5: file.md5 },
                  function(data) {
                    $this.data1 = data;
                    var status = data.status.value;
                    task.resolve();
                    if (status == 101) {
                      // 文件不存在，那就正常流程
                    } else if (status == 100) {
                      // 忽略上传过程，直接标识上传成功；
                      $this.uploader.skipFile(file);

                      file.pass = true;
                    } else if (status == 102) {
                      // 部分已经上传到服务器了，但是差几个模块。
                      file.missChunks = data.data;
                    }
                  }
                );
              });
            return $.when(task);
          },
          beforeSend: function(block) {
            var task = new $.Deferred();
            var file = block.file;
            var missChunks = file.missChunks;
            var blockChunk = block.chunk;

            if (
              missChunks !== null &&
              missChunks !== undefined &&
              missChunks !== ""
            ) {
              var flag = true;
              for (var i = 0; i < missChunks.length; i++) {
                if (blockChunk == missChunks[i]) {
                  flag = false;
                  break;
                }
              }

              if (flag) {
                task.reject();
              } else {
                task.resolve();
              }
            } else {
              task.resolve();
            }
            return $.when(task);
          }
        }
      );

      this.uploader = WebUploader.create({
        auto: true, // 选完文件后，是否自动上传
        //swf: "/static/lib/webuploader/Uploader.swf", // swf文件路径
        server: this.url, // 文件接收服务端
        pick: {
          id: this.uploadButton, // 选择文件的按钮
          multiple: this.multiple, // 是否多文件上传 默认false
          label: ""
        },
        accept: this.getAccept(this.accept), // 允许选择文件格式。
        threads: 3,
        fileNumLimit: this.fileNumLimit, // 限制上传个数
        //fileSingleSizeLimit: this.fileSingleSizeLimit, // 限制单个上传图片的大小
        formData: {
          uid: "",
          md5: "",
          chunkSize: 5 * 1024 * 1024
        }, // 上传所需参数
        chunked: true, //分片上传
        chunkSize: 5 * 1024 * 1024, //分片大小
        duplicate: true // 重复上传
      });
      // 在文件上传之前
      this.uploader.onUploadBeforeSend = function(obj, data) {
        var file = obj.file;
        data.md5 = file.md5 || "";
        data.uid = file.uid;
      };

      // 当有文件被添加进队列的时候，添加到页面预览

      // 单文件上传前
      this.uploader.on("fileQueued", file => {
        this.$emit("fileChange", file);
      });

      // 文件上传过程中创建进度条实时显示。
      this.uploader.on("uploadProgress", (file, percentage) => {
        this.$emit("progress", file, percentage);
      });
      this.uploader.on("uploadSuccess", (file, response) => {
        this.$emit("success", file, response);
      });
      this.uploader.on("uploadError", (file, reason) => {
        this.$emit("uploadError", file, reason);
      });
      this.uploader.on("error", type => {
        let errorMessage = "";
        if (type === "F_EXCEED_SIZE") {
          errorMessage = `文件大小不能超过${this.fileSingleSizeLimit /
            (1024 * 1000)}M`;
        } else if (type === "Q_EXCEED_NUM_LIMIT") {
          errorMessage = "文件上传已达到最大上限数";
        } else {
          errorMessage = `上传出错！请检查后重新上传！错误代码${type}`;
        }
        console.error(errorMessage);
        this.$emit("error", errorMessage);
      });
      this.uploader.on("uploadComplete", (file, response) => {
        this.$emit("complete", file, response);
      });
    },
    upload(file) {
      this.uploader.upload(file);
    },
    stop(file) {
      this.uploader.stop(file);
    },
    // 取消并中断文件上传
    cancelFile(file) {
      this.uploader.cancelFile(file);
    },
    // 在队列中移除文件
    removeFile(file, bool) {
      this.uploader.removeFile(file, bool);
    },
    getAccept(accept) {
      switch (accept) {
        case "text":
          return {
            title: "Texts",
            exteensions: "doc,docx,xls,xlsx,ppt,pptx,pdf,txt",
            mimeTypes: ".doc,docx,.xls,.xlsx,.ppt,.pptx,.pdf,.txt"
          };
          break;
        case "video":
          return {
            title: "Videos",
            exteensions: "mp4",
            mimeTypes:
              ".cd,.mp4,.asf,.avi,.dat,.f4v,.flv,.mkv,.mov,.mpeg,.mpg,.rm,.rmvb,.wmv,.mts,.3gp,.ram"
          };
          break;
        case "image":
          return {
            title: "Images",
            exteensions: "gif,jpg,jpeg,bmp,png",
            mimeTypes: ".gif,.jpg,.jpeg,.bmp,.png"
          };
          break;
        default:
          return accept;
      }
    }
  }
};
</script>

<style >
.webuploader-container {
  position: relative;
}
.webuploader-element-invisible {
  position: absolute !important;
  clip: rect(1px 1px 1px 1px); /* IE6, IE7 */
  clip: rect(1px, 1px, 1px, 1px);
}
.webuploader-pick {
  position: relative;
  display: inline-block;
  cursor: pointer;
  background: #00b7ee;
  padding: 10px 15px;
  color: #fff;
  text-align: center;
  border-radius: 3px;
  overflow: hidden;
}
.webuploader-pick-hover {
  background: #00a2d4;
}
.webuploader-pick-disable {
  opacity: 0.6;
  pointer-events: none;
}
</style>