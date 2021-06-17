<template>
  <div>
    <ajax
      :numbre_request="trigger_request"
      :data="data_post"
      :token="ajax_token"
      :debug="false"
      :show_alert_msg="show_alert_msg"
      :messages="ajax_messages"
      :url="url"
      @ev_ajax_success="ev_ajax_success"
      @ev_ajax_error="ev_ajax_error"
    ></ajax>
    <!-- On construit un formulaire basique -->
    <builder-forms
      :text_save="'Preparer'"
      :is_running="form_is_running"
      :disable_submit_keyenter="true"
      @ev_builder_forms="ev_builder_forms"
    >
      <template v-slot:form_top>
        <inputtextnew
          :label="'Numéro d\'identification'"
          :input="id_sortie"
          :rules="'required'"
          :mode="'passive'"
        ></inputtextnew>

        <input-datepicker-v2
          :label="'Date sortie'"
          :input="date_sortie"
          :id_html="'date-sortie-builder'"
          class="form-group"
          :mode="'passive'"
          data-text="find"
        ></input-datepicker-v2>

        <!--
        <input-date-picker
          :label="'Date sortie'"
          :input="date_sortie"
          :id_html="'date-sortie-builder'"
          class="form-group"
          :mode="'passive'"
          data-text="find"
        ></input-date-picker>
      -->
        <div class="border p-4 list-produits mb-4">
          <div
            v-for="(variant, index) in produits"
            :key="index"
            class="row mb-3"
          >
            <inputselectnew
              :label="'Selectionner le produit'"
              :input="variant.sku_produit"
              :id_html="index + 'sku_produit'"
              class="col-sm-4"
              :options="list_sku_produits"
              @ev_input="selection_variant_effectuer(index, ...arguments)"
              :rules="'required'"
              :mode="'passive'"
            ></inputselectnew>
            <inputnumber
              :label="'Quantité'"
              :input="variant.qt"
              class="col-sm-4"
              :id_html="index + 'qt'"
              :rules="'required'"
              :mode="'passive'"
            ></inputnumber>
            <inputselectnew
              :label="'Selectionner le numero de lot'"
              :input="variant.numero"
              class="col-sm-4"
              :id_html="index + 'numero'"
              :options="variant.list_numero"
              :rules="'required'"
              :mode="'passive'"
            ></inputselectnew>
            <span
              class="btn btn-sm btn-outline-danger button-remove border-0"
              @click="remove_variant(index)"
            >
              <i class="fas fa-trash"></i>
            </span>
          </div>
          <span class="btn btn-sm btn-outline-primary" @click="add_variant">
            <i class="fas fa-plus"></i>
          </span>
        </div>
      </template>
    </builder-forms>
  </div>
</template>

<script>
function default_variant() {
  return {
    sku_produit: {
      value: ""
    },
    qt: {
      value: ""
    },
    numero: {
      value: ""
    },
    list_numero: {}
  };
}
/**
 * Les informations de connections sont transmis à manage_connect
 */

import Ajax from "/siteweb/PluginsModules/stephane888/wbu-components/src/components/App/NutribeShopify/Ajax.vue";
import InputText from "/siteweb/PluginsModules/stephane888/wbu-components/src/components/Fomrs/Elements/InputText.vue";
import InputSelect from "/siteweb/PluginsModules/stephane888/wbu-components/src/components/Fomrs/Elements/InputSelect.vue";
import InputNumber from "/siteweb/PluginsModules/stephane888/wbu-components/src/components/Fomrs/Elements/InputNumber.vue";
//import InputDatepicker from "/siteweb/PluginsModules/stephane888/wbu-components/src/components/Fomrs/Elements/InputDatepickerDefault.vue";
export default {
  name: "gestionLotAmazon",
  data() {
    return {
      /**
       * Ajax.
       */
      trigger_request: 0,
      data_post: {},
      ajax_token: "",
      show_alert_msg: false,
      ajax_messages: {
        msg: "",
        type: ""
      },
      url: "",
      /**
       * formulaires
       */
      id_sortie: {
        value: ""
      },
      date_sortie: {
        value: ""
      },
      form_is_running: false,
      produits: [default_variant()],
      list_sku_produits: {}
    };
  },
  components: {
    ajax: Ajax,
    inputtextnew: InputText,
    inputselectnew: InputSelect,
    inputnumber: InputNumber
    //"input-date-picker": InputDatepicker
  },
  methods: {
    ev_ajax_success(datas) {
      console.log("ev_ajax_success : ", datas);
      if (datas.token === "lots_load_produit") {
        this.build__list_sku_produits(datas.return.products);
      } //
      else if (datas.token === "lots_load_numerolot_by_sku") {
        this.build__list_numero(datas.return.numeroLots, datas.configs.index);
      } //
      else if (datas.token === "lots_save_datas") {
        this.form_is_running = false;
      } else {
        this.form_is_running = false;
      }
    },
    ev_ajax_error() {
      this.form_is_running = false;
    },
    /**
     *
     */
    manage_connect(datas) {
      this.configs = datas;
      /**
       * On verifie si nous sommes en prod ou pas.
       */
      switch (datas.databaseConfig) {
        case "shopify-app":
          this.url = window.wbu_root + "/requets.php";
          break;
        default:
          if (window.location.host === "mynutribe-sandbox.kksa") {
            this.url = "/shopify/requets.php";
          } else {
            this.url = "/sandbox/shopify/requets.php";
          }
      }
      this.loadDatas();
    },
    ev_builder_forms(datas) {
      console.log("ev_builder_forms : ", datas);
      this.form_is_running = true;
      this.buildDataTosave();
    },
    add_variant() {
      this.produits.push(default_variant());
    },
    remove_variant(index) {
      this.produits.splice(index, 1);
    },
    loadDatas() {
      this.show_alert_msg = false;
      this.data_post = {
        databaseConfig: this.configs.databaseConfig
      };
      this.ajax_token = "lots_load_produit";
      this.trigger_request++;
    },
    build__list_sku_produits(sku_produits) {
      var lists = {};
      for (const i in sku_produits) {
        var sku_produit = sku_produits[i];
        lists[sku_produit.sku] =
          sku_produit.name !== "" ? sku_produit.name : sku_produit.sku;
      }
      this.list_sku_produits = lists;
    },
    build__list_numero(numeros, index) {
      var list_numero = {};
      for (const i in numeros) {
        var numero = numeros[i];
        list_numero[numero.numero] = numero.numero;
      }
      this.produits[index].list_numero = list_numero;
    },
    selection_variant_effectuer(index, val) {
      console.log("selection_variant_effectuer : ", index, " val ::", val);
      this.produits[index].list_numero = {};
      this.produits[index].numero.value = "";
      this.getListavailableNumero(index, val);
    },
    getListavailableNumero(index, sku_produit) {
      this.show_alert_msg = false;
      this.data_post = {
        databaseConfig: this.configs.databaseConfig,
        index: index,
        sku_produit: sku_produit
      };
      this.ajax_token = "lots_load_numerolot_by_sku";
      this.trigger_request++;
    },
    buildDataTosave() {
      this.show_alert_msg = true;
      var field = {
        id_sortie: this.id_sortie.value,
        date_sortie: this.date_sortie.value,
        products: this.produits
      };
      this.data_post = {
        databaseConfig: this.configs.databaseConfig,
        datas: field
      };
      this.ajax_token = "lots_save_datas";
      this.trigger_request++;
    }
  }
};
</script>
<style lang="scss">
.list-produits {
  > div {
    position: relative;
  }
}
.button-remove {
  position: absolute;
  top: 0;
  left: auto;
  right: 0;
}
</style>
<!--
/siteweb/PluginsModules/stephane888/wbu-components/src/components/App/NutribeShopify/cmpts/gestionLotAmazon.vue
-->
