<template>
  <div :_message_ajax="message_ajax">
    <transition name="fade">
      <div v-if="show_alert">
        <alert
          :show_alert="show_alert"
          :alert_attribut_class="class_alert"
          :alert_message="alert_message"
          @ev_alert_close="ev_alert_close_static"
        ></alert>
      </div>
    </transition>

    <builder-forms
      ref="builderformsselect"
      :forms="formated_forms_select"
      :show_submit="true"
      :form_contain_class="'w-100 '"
      :form_class="'row-0'"
      :is_running="form_is_running"
      @ev_builder_forms="ev_builder_forms_select"
    ></builder-forms>
  </div>
</template>

<script>
export default {
  name: "EditRowOrderProduct",
  props: {
    modal_body: {
      type: [Object, Array],
    },
  },
  data() {
    return {
      id_order: null,
      TrackingCompany: {},
      /**
       * Alert
       */
      show_alert: false,
      class_alert: "alert-danger",
      alert_message: "",
      /**
       *
       */
      form_is_running: false,
    };
  },
  methods: {
    ev_builder_forms_select(datas) {
      this.close_alert();
      this.$emit("ev_modal_simple", datas);
    },
    buildData(datas) {
      this.id_order = datas.datas.ligne.id_order;
      this.TrackingCompany = datas.TrackingCompany;
    },
    close_alert() {
      this.show_alert = false;
      this.class_alert = "";
      this.alert_message = "";
    },
    ev_alert_close_static() {
      this.close_alert();
    },
    alert_display(msg = null, type = "success") {
      if (msg == "") {
        this.close_alert();
        return false;
      }
      console.log("alert display");
      this.show_alert = true;
      this.class_alert = "alert-" + type;
      this.alert_message = msg;
    },
    setForm_is_running(val) {
      this.form_is_running = val;
    },
  },
  computed: {
    message_ajax: {
      get() {
        if (this.modal_body && this.modal_body.ajax_messages) {
          this.alert_display(
            this.modal_body.ajax_messages.msg,
            this.modal_body.ajax_messages.type
          );
          return this.modal_body.ajax_messages;
        }
        return "";
      },
    },
    formated_forms_select: {
      get() {
        if (this.modal_body) {
          this.buildData(this.modal_body);
          return [
            {
              template: "input-text", //requis
              input: {
                //requis
                value: "",
              },
              label: "Numéro de suivi", //requis
              name: "tracking_number", //requis
              rules: "required", //optionnel, en fonction de la nececcesité.
            },
            {
              template: "input-select",
              input: {
                value: "La Poste",
              },
              label: "Transporteur",
              name: "tracking_company",
              options: this.TrackingCompany,
            },
            {
              template: "input-select",
              input: {
                value: true,
              },
              label: "Envoyer un e‑mail de notification au client",
              name: "notify_customer",
              options: {
                true: "oui",
                false: "non",
              },
            },
          ];
        }
        return [];
      },
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
/siteweb/PluginsModules/stephane888/wbu-components/src/components/App/NutribeCompta/cmpts/EditRowOrderProduct.vue
-->
