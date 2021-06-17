<template>
  <div>
    <axios-ajax
      :numbre_request="numbre_request"
      :url="url"
      :data="data"
      :params="params"
      :headers="headers"
      :__token="formated_token"
      :debug="debug"
      :show_alert_msg="formated_show_alert_msg"
      :method="method"
      :messages="messages"
      :timeout="timeout"
      @ev_ajax_success="ev_ajax_success"
      @ev_ajax_error="ev_ajax_error"
      ref="ajax"
    ></axios-ajax>
  </div>
</template>

<script>
import axiosAjax from "../../Ajax/index.vue";
export default {
  name: "Ajax",
  props: {
    method: {
      type: String,
      default: "POST",
    },
    numbre_request: {
      type: Number,
      default: 0,
    },
    url: {
      type: String,
      default: "/comptabilte/getcommandes.php",
    },
    params: {
      type: Object,
      default: function () {
        return {};
      },
    },
    data: {
      type: [Object, String],
      default: "",
    },
    debug: {
      type: Boolean,
      default: true,
    },
    show_alert_msg: {
      type: Boolean,
      default: true,
    },
    token: {
      type: String,
    },
    messages: {
      type: Object,
    },
    timeout: {
      type: Number,
      default: 30000,
    },
  },
  components: {
    "axios-ajax": axiosAjax,
  },
  data: function () {
    return {
      headers: {},
      VueAjax: {},
    };
  },
  mounted() {
    this.VueAjax = this.$refs.ajax;
  },
  computed: {
    formated_token: {
      get() {
        this.addTokenInheaders();
        return this.token;
      },
    },
    formated_show_alert_msg: {
      get() {
        if (this.debug) {
          return true;
        }
        if (!this.show_alert_msg) {
          return false;
        }
        return true;
      },
    },
  },
  methods: {
    addTokenInheaders() {
      if (this.token !== "") {
        this.headers = {
          "X-CSRF-Token": this.token,
        };
      }
    },
    ev_ajax_success(datas) {
      this.$emit("ev_ajax_success", datas);
    },
    ev_ajax_error(datas) {
      this.$emit("ev_ajax_error", datas);
    },
  },
  /*
  mounted() {
    if (this.token !== "") {
      this.headers = {
        "X-CSRF-Token": this.token
      };
    }
  }
  /**/
};
</script>

<!--
/siteweb/PluginsModules/stephane888/wbu-components/src/components/App/NutribeCompta/Ajax.vue
-->
