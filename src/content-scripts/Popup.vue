<script>
import { defineComponent, ref, onMounted, reactive, toRefs } from "vue";
import {
  useMutation,
  useQuery,
  useResult,
  useApolloClient,
} from "@vue/apollo-composable";
import Classify from "./components/Classify.vue";
import Footer from "./components/Footer.vue";
import gql from "graphql-tag";
import Toggle from "@vueform/toggle";

export default defineComponent({
  name: "Popup",
  components: {
    Classify,
    Footer,
    Toggle,
  },
  setup() {
    const now = ref("saving");
    const title = ref("위시템을 저장 중입니다");
    const footerVisibility = ref(false);
    const bodyVisibility = ref(false);
    const thumb = ref(
      "chrome-extension://ghlehbaadkhaeglpngmpecnmphoilibf/loader.gif"
    );
    const button = ref("저장");
    const baseUrl = ref("chrome-extension://ghlehbaadkhaeglpngmpecnmphoilibf/");
    const containerVisibility = ref(false);
    const mybuckets = ref([]);
    const seen = ref(true);
    const visible = ref(true);
    const value = ref(true);
    var token = "";
    const state = reactive({
      currentTab: null,
    });
    getToken();
    onMounted(() => {
      chrome.runtime.sendMessage({ type: "POPUP_INIT" }, async (tab) => {
        state.currentTab = await tab;
      });
    });
    const MUTATION_ZIM = gql`
        mutation{
          zimItem(input:{url:"${location.href}",tags:[]}){
            message
          }
        }
      `;
    const MUTATION_TOKEN = gql`
      mutation refreshToken($token: String!) {
        authenticate(input: { accessToken: $token, identityProvider: GUEST }) {
          message
          token
        }
      }
    `;
    const QUERY_MYZIMFOLDERS = gql`
      query {
        zimFolderConnection(filter: {}) {
          cursor
          hasNextPage
          zimFolders {
            tag {
              name
            }
          }
        }
      }
    `;
    const { client } = useApolloClient();
    async function getZimFolders() {
      return client.query({
        query: QUERY_MYZIMFOLDERS,
        context: {
          headers: {
            authorization: token ? `Bearer ${token}` : "",
          },
        },
      });
    }
    const {
      mutate: zimItem,
      onDone: ZimComplete,
      onError: ZimError,
    } = useMutation(MUTATION_ZIM);
    ZimComplete(() => {
      getZimFolders().then((res) => {
        let tmpArr = res.data.zimFolderConnection.zimFolders;
        for (let i in tmpArr) {
          mybuckets.value.push(tmpArr[i].tag.name);
        }
      });
      setState("savecomplete");
    });
    ZimError((err) => {
      console.log(err);
      refreshToken({
        token,
      });
    });

    const {
      mutate: refreshToken,
      onDone: refreshComplete,
      onError: refreshError,
    } = useMutation(MUTATION_TOKEN);
    refreshComplete((result) => {
      chrome.storage.local.set({ token: result.data.authenticate.token });
      chrome.runtime.sendMessage({
        type: "reToken",
        token: result.data.authenticate.token,
      });
    });
    refreshError((err) => {
      console.log(err);
    });

    function getToken() {
      chrome.storage.local.get(["token"], (a) => {
        token = a.token;
      });
    }

    function setState(state) {
      if (state === "savecomplete") {
        now.value = state;
        button.value = "삭제";
        thumb.value = baseUrl.value + "check.png";
        title.value = "저장 완료!";
        bodyVisibility.value = true;
        footerVisibility.value = true;
      } else if (state === "deleting") {
        now.value = state;
        button.value = "저장";
        thumb.value = baseUrl.value + "loader.gif";
        title.value = "위시템을 삭제 중입니다";
      } else if (state === "deletecomplete") {
        now.value = state;
        button.value = "저장";
        thumb.value = baseUrl.value + "check.png";
        title.value = "삭제 완료!";
      } else if (state === "saving") {
        now.value = state;
        button.value = "삭제";
        thumb.value = baseUrl.value + "loader.gif";
        title.value = "위시템을 저장 중입니다";
      } else if (state === "addBucket") {
        now.value = state;
        button.value = "삭제";
        thumb.value = baseUrl.value + "loader.gif";
        title.value = "위시템을 저장 중입니다";
        bodyVisibility.value = false;
        footerVisibility.value = false;
      } else if (state === "toBucket") {
        now.value = state;
        thumb.value = baseUrl.value + "loader.gif";
        title.value = "버킷에 담는 중입니다";
      } else if (state === "toBucketComplete") {
        now.value = state;
        thumb.value = baseUrl.value + "check.png";
        title.value = "버킷 담기 완료!";
      }
    }

    function buttonclick() {
      if (button.value === "저장" && now.value === "saving") {
        now.value === "";
        containerVisibility.value = true;
        zimItem();
      }
    }

    function plusButton() {
      setState("addBucket");
    }

    function cancelButton() {
      setState("savecomplete");
    }
    function addtonewbucket(){
      setState("savecomplete");
    
    }

    return {
      now,
      title,
      thumb,
      button,
      visible,
      containerVisibility,
      footerVisibility,
      bodyVisibility,
      mybuckets,
      value,
      ...toRefs(state),
      buttonclick,
      setState,
      plusButton,
      cancelButton,
      addtonewbucket,
    };
  },
});
</script> 


<template>
  <div
    id="wishbucket-container"
    v-show="containerVisibility"
    v-click-outside="
      () => {
        containerVisibility = false;
      }
    "
  >
    <div class="saving">
      <div v-if="now !== 'addBucket'">
        <div class="loading top">
          <div class="imgwrap"><img :src="thumb" alt /></div>
        </div>
        <div id="saving" class="top">{{ title }}</div>
        <div class="wishbucket-button">
          <button @click="buttonclick" disabled id="wishButton">
            <p>{{ button }}</p>
          </button>
        </div>
      </div>
      <div v-else>
        <div class="paddinglayer">
          <div class="newBucket"><p>새 버킷 만들기</p></div>
          <div class="newBucketName"><p>새 버킷 이름</p></div>
          <div class="input"><input spellcheck="false" /></div>
          <div class="isOpen">
            <p>비공개 버킷</p>
            <Toggle
              v-model="value"
              on-label="Yes"
              off-label="No"
              on-background="#7F50FF"
              :width="80"
              :height="30"
            />
          </div>
          <div class="bottonButtons">
            <button @click="cancelButton" class="bottomButton cancel">
              취소
            </button>
            <button @click="addtonewbucket" class="bottomButton toBucket">새 버킷에 담기</button>
          </div>
        </div>
      </div>
      <Classify
        v-show="bodyVisibility"
        :buckets="mybuckets"
        :plusButton="plusButton"
        :setState="setState"
      />
      <Footer v-show="footerVisibility" />
    </div>
  </div>
</template>

<style src="@vueform/toggle/themes/default.css">
</style>
<style>
:root {
  --toggle-bg-on: #7f50ff;
  --toggle-border-on: #7f50ff;
  --toggle-width: 3rem;
  --toggle-height: 1.25rem;
  --toggle-border: 0.125rem;
  --toggle-font-size: 0.75rem;
  --toggle-duration: 150ms;
  --toggle-bg-off: #e5e7eb;
  --toggle-bg-on-disabled: #d1d5db;
  --toggle-bg-off-disabled: #e5e7eb;
  --toggle-border-off: #e5e7eb;
  --toggle-border-on-disabled: #d1d5db;
  --toggle-border-off-disabled: #e5e7eb;
  --toggle-ring-width: 0px;
  --toggle-ring-color: #ffffff00;
  --toggle-text-on: #ffffff;
  --toggle-text-off: #374151;
  --toggle-text-on-disabled: #9ca3af;
  --toggle-text-off-disabled: #9ca3af;
  --toggle-handle-enabled: #ffffff;
  --toggle-handle-disabled: #f3f4f6;
}
#wishbucket-root {
  all: unset;
  background-color: none !important;
  padding: 0 !important;
  position: fixed;
  top: 0px;
  right: 0px;
  z-index: 9223372036854775807;
  color: black;
  font-family: "Noto Sans KR";
}
#wishbucket-root #wishbucket-container {
  background: rgb(255, 255, 255) !important;
  box-shadow: 0px 0px 14px rgba(0, 0, 0, 0.15) !important;
  border: 1px !important;
  border-color: gray !important;
  width: 328px !important;
  border-radius: 36px !important;
  /* border-top-right-radius: 33px;
  border-top-left-radius: 33px; */
  margin-right: 10px;
  margin-top: 10px;
  text-align: center;
  float: right;
  height: auto;
  /* display: none; */
}
#wishbucket-root .saving {
  height: auto;
  width: 328px;
}
#wishbucket-root .saving > div:nth-child(1) {
  width: 328px;
  height: auto;
}
#wishbucket-root #saving {
  vertical-align: auto !important;
  font-family: "Noto Sans KR" !important;
  font-weight: 400 !important;
  font-style: normal !important;
  font-weight: 700 !important;
  font-size: 16px !important;
}
#wishbucket-root .complete {
  height: 85px;
  margin: 0;
}
#wishbucket-root #complete {
  vertical-align: auto;
  font-size: 15px;
  font-family: "Noto Sans KR";
  font-weight: 400;
  font-style: normal;
  font-weight: 700;
  font-size: 16px;
}
#wishbucket-root .top {
  float: left;
  line-height: 75px;
  margin: 5px;
}
#wishbucket-root .wishbucket-button {
  float: right !important;
  height: 75px !important;
  margin: 5px !important;
  margin-right: 25px !important;
}
#wishbucket-root .loading {
  margin-left: 20px;
}
#wishbucket-root div.top img {
  width: 30px;
  height: 30px;
}
#wishbucket-root .imgwrap {
  line-height: 0px;
  margin-top: 22.5px;
  margin-bottom: 22.5px;
}

#wishbucket-root div.wishbucket-button > button {
  font-family: "Noto Sans KR" !important;
  background-color: none !important;
  padding: 0 !important;
  vertical-align: middle;
  margin: 15px 0px 0px 0px !important;
  width: 54px !important;
  height: 40px !important;
  border-radius: 15px !important;
  border: none !important;
  font-family: "Noto Sans KR" !important;
  font-style: normal !important;
  font-weight: 700 !important;
  background: #e6e6e6 !important;
  color: black !important;
}
#wishbucket-root button > p {
  line-height: 40px;
  margin: 0px;
  padding: 0px;
  text-align: center !important;
  font-size: 12px !important;
}
#wishbucket-root .text_area {
  vertical-align: auto;
  text-align: left;
  font-size: 14px;
  font-family: "Noto Sans KR";
  font-weight: 400;
  font-style: normal;
  font-weight: 700;
  width: 254px;
  float: left;
  color: #000000;
}
#wishbucket-root div.paddinglayer {
  margin: 0px;
  padding: 22px 22px 30px 22px;
}
#wishbucket-root div.newBucket {
  font-family: "Noto Sans KR" !important;
  font-style: normal !important;
  font-weight: 700 !important;
  font-size: 14px !important;
  line-height: 21px !important;
  /* identical to box height */
  text-align: center;
  color: #181717;
  margin: 0px 0px 50px 0px;
  padding: 0px;
}
#wishbucket-root div.newBucket > p {
  font-family: "Noto Sans KR" !important;
  font-style: normal !important;
  font-weight: 700 !important;
  font-size: 14px !important;
  /* identical to box height */
  text-align: center;
  color: #181717;
  margin: 0px;
  padding: 0px;
}
#wishbucket-root div.newBucketName {
  font-family: "Noto Sans KR";
  font-style: normal;
  font-weight: 500;
  font-size: 12px;
  line-height: 18px;
  /* identical to box height */
  color: #565656;
  margin: 0px;
  padding: 0px;
  text-align: left;
}
#wishbucket-root div.newBucketName > p {
  font-family: "Noto Sans KR";
  font-style: normal;
  font-weight: 500;
  font-size: 12px;
  /* identical to box height */
  color: #565656;
  margin: 0px;
  padding: 0px;
  text-align: left;
}
#wishbucket-root div.input {
  font-family: "Noto Sans KR";
  font-style: normal;
  font-weight: 500;
  font-size: 12px;
  line-height: 18px;
  /* identical to box height */
  color: #565656;
  margin: 10px 0px 0px 0px;
  padding: 0px;
  text-align: center;
  border-bottom: 2px solid #7f50ff;
}
#wishbucket-root div.input input {
  width: 100%;
  border: none;
  font-family: "Yde street";
  font-style: normal;
  font-weight: 700;
  font-size: 16px;
  line-height: 21px;
  text-align: center;
  margin: 8px 0px;
}
#wishbucket-root div.input input:focus {
  outline: none;
}
#wishbucket-root div.isOpen {
  margin: 22px 0px 56px 0px;
  padding: 0px;
  border: 0px;
  text-align: left;
}
#wishbucket-root div.isOpen > p {
  font-family: "Noto Sans KR";
  font-style: normal;
  font-weight: 500;
  font-size: 12px;
  line-height: 18px;
  color: #565656;
  text-align: left;
  display: inline-block;
  width: 65px;
}
#wishbucket-root div.toggle-container {
  display: inline-block;
  margin-left: 15px;
}
#wishbucket-root button.bottomButton {
  width: 137px;
  height: 54px;
  background: #e6e6e6;
  border-radius: 16px;
  text-align: center;
  color: #181717;
  margin: 0px 10px 0px 0px;
  border: 0px;
  padding: 0px;
  font-family: 'Noto Sans KR';
  font-style: normal;
  font-weight: 700;
  font-size: 13px;
}
#wishbucket-root button.toBucket {
  width: 137px;
  height: 54px;
  background: #7f50ff;
  border-radius: 16px;
  color: #ffffff;
  margin: 0px;
  border: 0px;
  padding: 0px;
}
</style>
