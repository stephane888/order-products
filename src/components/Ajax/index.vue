<!--
tres bon article pour la mise à jour et la reduction des fichiers utiliser
- https://dev.to/ljnce/use-axios-api-with-vue-cli-54i2
- https://medium.com/spemer/using-axios-in-vue-js-17f186756a8b
-->
<template>
  <div :__formated_trigger_send_data="formated_trigger_send_data">
    <transition name="fade">
      <div v-if="show_alert">
        <alert
          :show_alert="show_alert"
          :alert_attribut_class="class_alert"
          :alert_message="alert_message"
          @ev_alert_close="alert_close_static"
        ></alert>
      </div>
    </transition>
    <div v-if="show_number_request && debug">
      Nombre de requettes : {{ formated_trigger_send_data }};
    </div>
  </div>
</template>

<script>
/**
 * axios doit etre definie;
 */
var axios;
if (window.axios) {
  axios = window.axios;
} else {
  //import axios from "axios";
}
export default {
  name: "Ajax",
  props: {
    method: {
      type: String,
      default: "POST",
    },
    url: {
      type: String,
      default: "",
    },
    // `headers` are custom headers to be sent
    headers: {
      type: Object,
      default: function () {
        return {};
      },
    },
    // `params` are the URL parameters to be sent with the request
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
    response_type: {
      type: String,
      default: "json",
    },
    timeout: {
      type: Number,
      default: 15000,
    },
    //
    numbre_request: {
      type: Number,
      default: 0,
    },
    show_number_request: {
      type: Boolean,
      default: true,
    },
    debug: {
      type: Boolean,
      default: true,
    },
    show_alert_msg: {
      type: Boolean,
      default: true,
    },
    error_default: {
      type: String,
      default: "Une erreur s'est produite : Ajax",
    },
    success_default: {
      type: String,
      default: "Traitement terminée",
    },
    /**
     * on force l'affiche de l'erreur,
     * si desactivé aucun message ne s'affiche.
     */
    force_display_error_msg: {
      type: Boolean,
      default: true,
    },
    /**
     * Permet de retourner les informations apres execution d'ajax.
     * ( les valeurs par defaut sont plus à titre indicatifs. => requis pour l'instance qui affiche )
     */
    messages: {
      type: Object,
      default: function () {
        return {
          msg: "",
          type: "",
        };
      },
    },
  },
  data: function () {
    return {
      /**
       * Alert
       */
      show_alert: false,
      class_alert: "alert-danger",
      alert_message: "",
      //
      show: true,
    };
  },
  computed: {
    formated_trigger_send_data: {
      get() {
        if (this.numbre_request > 0) {
          this.sendDatas();
        }
        return this.numbre_request;
      },
    },
  },
  methods: {
    sendDatas() {
      var self = this;
      this.close_alert();
      axios({
        method: self.method,
        url: self.url,
        headers: self.headers,
        responseType: self.response_type,
        params: self.params,
        timeout: self.timeout,
        data: self.data,
      })
        .then((rps) => {
          if (self.debug) {
            console.log("Ajax reposnse : ", rps);
          }
          (function () {
            self.messages.type = "success";
            if (rps.request && rps.request.statusText) {
              self.messages.msg = decodeURIComponent(rps.request.statusText);
              self.alert_display_msg_success(self.messages.msg);
            } else {
              self.messages.msg = self.success_default;
              self.alert_display_msg_success();
            }
          })();
          (function () {
            if (rps.data) {
              self.$emit("ev_ajax_success", rps.data);
            } else {
              self.$emit("ev_ajax_success", rps);
            }
          })();
        })
        .catch(function (error) {
          //console.log("error : ", error);
          console.log("error.response : ", error.response);
          console.log("error.code : ", error.code);
          console.log("error.stack : ", error.stack);
          (function () {
            if (error.response) {
              self.messages.msg = decodeURIComponent(
                error.response.request.statusText
              );
              self.messages.type = "warning";
              self.alert_display_msg_warning(self.messages.msg);
            } else {
              if (error.code === "ECONNABORTED") {
                self.messages.msg = "Delai d'attente depassé";
              } else {
                self.messages.msg = self.error_default;
              }
              self.messages.type = "danger";
              self.alert_display_msg_danger();
            }
          })();
          (function () {
            if (error.response) {
              self.$emit("ev_ajax_error", error.response);
            } else {
              self.$emit("ev_ajax_error", error);
            }
          })();
        })
        .finally(function () {
          if (self.debug) {
            console.log("ajax end.");
          }
        });
    },
    close_alert() {
      this.show_alert = false;
      this.class_alert = "";
      this.alert_message = "";
      this.messages.msg = "";
      this.messages.type = "";
    },
    alert_close_static() {
      this.close_alert();
    },
    alert_display(msg = null, type = "success") {
      if (!this.show_alert_msg && type === "success") {
        return false;
      }
      if (!this.force_display_error_msg) {
        return false;
      }

      this.show_alert = true;
      this.class_alert = "alert-" + type;
      this.alert_message = msg;
    },
    alert_display_msg_danger(msg = null) {
      this.alert_display(msg, "danger");
    },
    alert_display_msg_warning(msg = null) {
      this.alert_display(msg, "warning");
    },
    alert_display_msg_success(msg = null) {
      this.alert_display(msg, "success");
    },
  },
};
</script>

<style lang="scss" scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.5s;
}
.fade-enter,
.fade-leave-to {
  opacity: 0;
}
</style>
<!--
- n'exister pas à regarder https://github.com/axios/axios pour plus d'infos sur la config.
-->

<!--
/siteweb/PluginsModules/stephane888/wbu-components/src/components/Ajax/index.vue
-->
