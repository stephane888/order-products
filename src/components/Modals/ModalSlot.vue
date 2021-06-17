<template>
  <div>
    <!-- Modal (empeche d'ecrire dans l'input type text tabindex="-1" )-->
    <div
      :class="[
        type_modal_bootstrap
          ? 'modal fade'
          : 'modal-custom ' + formated_open_modal_custom
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
            <slot name="modal_header" :id="id_modal + 'Label'">
              Titre modal
            </slot>
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
            <slot
              :id="id_modal + 'Label'"
              @ev_modal_simple="ev_modal_simple"
              :doaction="actionparent"
              :is_runing="is_runing"
            >
            </slot>
          </div>
          <div class="modal-footer " v-show="show_footer">
            <slot
              name="modal_footer"
              @ev_modal_simple_footer="ev_modal_simple_footer"
              :doaction="actionparent"
              :is_runing="is_runing"
            >
            </slot>
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
    id_modal: {
      type: String,
      default: "myModal"
    },
    type_modal_bootstrap: {
      type: Boolean,
      default: true
    },
    modal_position: {
      type: String,
      default: "modal-dialog-centered"
    },
    open_modal_custom: {
      type: Boolean,
      default: false
    },
    show_footer: {
      type: Boolean,
      default: true
    },
    actionparent: [Object, Array, String, Number],
    is_runing: {
      type: [Boolean],
      default: false
    }
  },
  data: function() {
    return {
      modal_custom_class: ""
    };
  },
  computed: {
    titre_modal: {
      get: function() {
        return decodeURIComponent(this.titre_modal_preview);
      }
    },
    formated_open_modal_custom: {
      get() {
        if (this.open_modal_custom) {
          return "show-custom-modal";
        }
        return "";
      }
    }
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
    }
  }
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
    /siteweb/PluginsModules/stephane888/wbu-components/src/components/Modals/ModalSlot.vue
-->
