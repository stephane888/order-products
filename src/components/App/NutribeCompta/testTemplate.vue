<template lang="html">
  <div>...</div>
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

/**
 * Contient les bouttons pour les actions au niveau de la cellule action
 */
import TemplateTableauAction from "./cmpts/ActionOrderProduct.vue";

export default {
  name: "testTemplate*",
  props: {
    //
  },
  components: {
    //
  },
  data() {
    return {
      /**
       *ajax
       */
      url_post: "",
      headers: {},
      post_datas: {},
      trigger_post_loanding: 0,
      root: $("body").attr("data-root"),
      /**
       * Ajax
       */
      trigger_request: 0,
      data_post: {},
      ajax_token: "",
      show_alert_msg: false,
      /**
       * Tableau
       */
      //table_rows: {},
      table_headers: {},
      //
      table_rows_v2: [],
      table_headers_v2: {},
      class_table: "light-table table-total",
      class_table2: "light-table table-unite",
      template_table_footer: "",
      table_template_tableau_action: TemplateTableauAction,
      table_show_action: false,
      /**
       *
       */
      configs_watch: {},
      /**
       * Modal simple.
       */
      actionparent: "",
      template_modal_body: "",
      modal_body: {},
      titre_modal: "",
      id_modal: "row",
      TrackingCompany: {},
      ajax_messages: {
        msg: "",
        type: "",
      },
      order_id: "",
      VueFormEdit: {},
      VueAjax: {},
      ajax_url: "/comptabilte/getcommandes.php",
      /**
       * Rapport
       */
      listes_vente_sku_shopify: [],
      listes_vente_sku_amazon: [],
      /**
       *datas
       */
      nombre_commande_a_traiter: 0,
      /**
       * Pour empecher la recharge du bloc produit a traiter si on change la date.
       */
      fullfiment_loader: false,
      databaseConfig: "",
      database_config: "",
      intervalRefresh: 120000,
      intervalid1: null,
    };
  },
  mounted() {
    this.refreshCommandes();
  },
  watch: {
    //
  },
  computed: {
    //
  },
  methods: {
    refreshCommandes() {
      console.log("reload datas :ajax_url:: ", this.ajax_url);
      this.intervalid1 = setInterval(() => {
        console.log("reload datas : ", this.intervalRefresh);
      }, 10000);
    },
  },
};
</script>

<style lang="scss" scoped></style>

<!--
 //nom du fichier en pascal.
 //<template>
 - le nom des attributs en kebab-case;
 - la valeur des attributs et des variables en camelCase;
 - function en PascalCase
 //props, data
 - variable en camelCase
 //methods
 - variable en PascalCase
-->
