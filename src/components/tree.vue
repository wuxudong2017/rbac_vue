<template>
  <div class="tree-list">
    <ul v-for="(item,index) in applicationTypeTreeList" :key="index" class="list-ul">
      <li
        class="list-title"
        @click="clickAppType(item.id)"
        :style="{height:appTypeId == item.id?treeHeight:'40px'}"
        :title="item.type_name"
      >
        <img
          src="@/assets/webicon213.png"
          alt
          :style="{transform:appTypeId == item.id?'rotate(90deg)':'rotate(0deg)'}"
        />
        {{item.type_name}}
        <ul v-if="appTypeId == item.id && item.help_center_applications" id="tree-children">
          <li
            v-for="(item1,index) in item.help_center_applications"
            :key="index"
            class="list-li"
            :style="{backgroundColor:applicationId == item1.id?'#e5f5fd':'#fff'}"
            @click.stop="clickApp(item1.id)"
            :title="item1.name"
          >{{item1.name}}</li>
        </ul>
      </li>
    </ul>
  </div>
</template>

<script>
import {
  applicationListN,
  problemList,
  problemAdd,
  problemUpdate,
  problemDelete,
  productTypeTreeList
} from "@/api/helpcenter";
import service from "@/utils/service";
import { mapGetters } from "vuex";
export default {
  data() {
    return {
      applicationTypeTreeList: [],
      treeHeight: "40px"
    };
  },
  computed: {
    ...mapGetters(["applicationId", "appTypeId"])
  },
  mounted() {
    this.getApplicationTypeTreeList();
  },
  methods: {
    // 获取应用,分类列表
    getApplicationTypeTreeList() {
      let $this = this;
      productTypeTreeList().then(res => {
        if (res.data) {
          $this.applicationTypeTreeList = res.data;

          if (!$this.appTypeId) {
            $this.$store.commit(
              "SET_APPTYPE_ID",
              res.data.length > 0 ? res.data[0].id : ""
            );
            sessionStorage.setItem(
              "appTypeId",
              res.data.length > 0 ? res.data[0].id : ""
            );

            if (!$this.applicationId) {
              if (res.data.length > 0) {
                if (res.data[0].help_center_applications.length > 0) {
                  $this.$store.commit(
                    "SET_APPLICATION_ID",
                    res.data[0].help_center_applications[0].id
                      ? res.data[0].help_center_applications[0].id
                      : ""
                  );
                  sessionStorage.setItem(
                    "applicationId",
                    res.data[0].help_center_applications[0].id
                      ? res.data[0].help_center_applications[0].id
                      : ""
                  );
                }
              }
              setTimeout(() => {
              let treeHeight1 = document.getElementById("tree-children")?document.getElementById("tree-children").offsetHeight:0;
              $this.treeHeight = treeHeight1 + 40 + "px";
            }, 200);
            }
          } else {
            setTimeout(() => {
              let treeHeight1 = document.getElementById("tree-children")?document.getElementById("tree-children").offsetHeight:0;
              $this.treeHeight = treeHeight1 + 40 + "px";
            }, 200);
          }
        }
      });
    },
    // 点击分类
    clickAppType(e) {
      this.$store.commit("SET_APPTYPE_ID", e);
      sessionStorage.setItem("appTypeId", e);
      setTimeout(() => {
          let treeHeight1 = document.getElementById("tree-children")?document.getElementById("tree-children").offsetHeight:0;
          this.treeHeight = treeHeight1 + 40 + "px";
        }, 200);
    },
    // 点击应用
    clickApp(e) {
      this.$store.commit("SET_APPLICATION_ID", e);
      sessionStorage.setItem("applicationId", e);
    }
  }
};
</script>

<style lang="scss">
.tree-list {
  width: 300px;
  height: 100%;
  overflow-y: auto;

  .list-ul {
    width: 300px;

    .list-title {
      width: 300px;
      min-height: 40px;
      height: 100%;
      border-bottom: 1px solid #f8f8f8;
      font-size: 14px;
      line-height: 40px;
      padding-left: 30px;
      position: relative;
      cursor: pointer;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
      transition: height 0.5s;
      // div{
      img {
        width: 16px;
        height: 16px;
        position: absolute;
        top: 12px;
        left: 8px;
        transition: transform 1s;
      }

      ul {
        transition: height 1s;
        margin-left: -30px;
        .list-li {
          width: 300px;
          height: 40px;
          border-bottom: 1px solid #f8f8f8;
          font-size: 14px;
          line-height: 40px;
          padding-left: 50px;
          cursor: pointer;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }

        .list-li:hover {
          background-color: #e5f5fd;
        }
      }
      // }
    }
  }
}
</style>