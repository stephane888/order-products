<template>
  <div>
    <!-- Modal (empeche d'ecrire dans l'input type text tabindex="-1" )-->
    <div
      :class="[
        type_modal_bootstrap
          ? 'modal fade'
          : 'modal-custom ' + formated_open_modal_custom,
      ]"
      :id="id_modal"
      role="dialog"
      :aria-labelledby="id_modal + 'Label'"
      aria-hidden="true"
    >
      <div
        class="modal-dialog modal-lg"
        :class="modal_position"
        role="document"
      >
        <div class="modal-content">
          <div class="modal-header">
            <h5
              class="modal-title"
              :id="id_modal + 'Label'"
              v-html="titre_modal"
            ></h5>
            <button
              type="button"
              class="close"
              aria-label="Close"
              @click="close_and_false"
            >
              <span aria-hidden="true">&times;</span>
            </button>
          </div>
          <div class="modal-body">
            <!-- custom template -->
            <component
              v-bind:is="template_modal_body"
              :modal_body="datas_modal_body"
              :customdatas1="customdatas1"
              :customdatas2="customdatas2"
              :customdatas3="customdatas3"
              :customdatas4="customdatas4"
              :doaction="actionparent"
              :is_runing="is_runing"
              @ev_modal_simple="ev_modal_simple"
              ref="cpts_modal_simple"
            ></component>
          </div>
          <div class="modal-footer" v-show="show_footer">
            <component
              v-bind:is="template_modal_footer"
              :modal_footer="datas_modal_footer"
              :is_runing="is_runing"
              @ev_modal_simple_footer="ev_modal_simple_footer"
            ></component>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
/**
 * Jquery doit etre definie;
 */
var $;
if (window.jQuery) {
  $ = window.jQuery;
} else if (window.$) {
  $ = window.$;
}
export default {
  name: "ModalSimple",
  props: {
    datas_modal_body: [Object, Array, String, Number],
    datas_modal_footer: [Object, Array, String, Number],
    id_modal: {
      type: String,
      default: "myModal",
    },
    type_modal_bootstrap: {
      type: Boolean,
      default: true,
    },
    modal_position: {
      type: String,
      default: "modal-dialog-centered",
    },
    // titre_modal:{type: String,default: "titre du modal"},
    titre_modal_preview: {
      type: String,
      default: "titre du modal",
    },
    template_modal_body: {
      type: [String, Object],
      default: "",
    },
    template_modal_footer: {
      type: [Object, String],
      default: "",
    },
    open_modal_custom: {
      type: Boolean,
      default: false,
    },
    show_footer: {
      type: Boolean,
      default: true,
    },
    actionparent: [Object, Array, String, Number],
    is_runing: {
      type: [Boolean],
      default: false,
    },
    /**
     * on definie un essemble de taleau (customdatas1 à 4)
     * On verra apres comment corriger cela ou une approche GOOD.
     */
    customdatas1: [Object, Array, String, Number, Boolean],
    customdatas2: [Object, Array, String, Number, Boolean],
    customdatas3: [Object, Array, String, Number, Boolean],
    customdatas4: [Object, Array, String, Number, Boolean],
  },
  data: function () {
    return {
      modal_custom_class: "",
    };
  },
  computed: {
    titre_modal: {
      get: function () {
        return decodeURIComponent(this.titre_modal_preview);
      },
    },
    formated_open_modal_custom: {
      get() {
        if (this.open_modal_custom) {
          return "show-custom-modal";
        }
        return "";
      },
    },
  },
  methods: {
    ev_modal_simple(datas) {
      this.$emit("ev_modal_simple", datas);
    },
    ev_modal_simple_footer(datas) {
      this.$emit("ev_modal_simple_footer", datas);
    },
    close_and_false() {
      if (this.type_modal_bootstrap) {
        $("#" + this.id_modal).modal("hide");
      } else {
        /**
         * il fzut emettre un evenement pour informer le parent que le bloc doit etre fermer
         */
        this.$emit("ev_modal_simple", { action: "close" });
      }
    },
    close_modal_confirm() {
      alert("");
    },
  },
};
</script>

<style lang="scss" scoped>
/**
 *  modal-custom
 */
.modal-custom {
  display: none;
  &.show-custom-modal {
    display: block;
    position: absolute;
    z-index: 9999;
    left: 0;
    right: 0;
    top: 0;
    bottom: 0;
    .modal-dialog {
      max-width: calc(100% - 30px);
    }
  }
  &::before {
    content: "";
    background: rgba(0, 0, 0, 0.65);
    left: 0;
    right: 0;
    top: 0;
    bottom: 0;
    position: absolute;
    z-index: 0;
  }
}
</style>

<!--
    /siteweb/PluginsModules/stephane888/wbu-components/src/components/Modals/ModalSimple.vue
-->
