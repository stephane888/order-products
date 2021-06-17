<template>
  <div>
    <ajax
      :numbre_request="trigger_request"
      :data="data_post"
      :token="ajax_token"
      :debug="false"
      :show_alert_msg="show_alert_msg"
      @ev_ajax_success="ev_ajax_success"
    ></ajax>
    <tableau-gestion
      :rows="table_rows"
      :headers="table_headers"
    ></tableau-gestion>
  </div>
</template>

<script>
import load_configs from "../configs.js";
import ajax from "/siteweb/PluginsModules/stephane888/wbu-components/src/components/App/NutribeShopify/Ajax.vue";
const configs = load_configs;
export default {
  name: "ListCategories",
  data: function() {
    return {
      /**
       *table
       */
      table_rows: [],
      table_headers: {},
      /**
       * Ajax
       */
      trigger_request: 0,
      data_post: {},
      ajax_token: "",
      show_alert_msg: false
    };
  },
  components: {
    ajax: ajax
  },
  mounted() {
    console.log(" Chargement du module : ListCategories.vue ");
    this.databaseConfig = configs.databaseConfig;
    this.getDatas();
  },
  methods: {
    getDatas() {
      this.show_alert_msg = false;
      this.data_post = {
        databaseConfig: this.databaseConfig,
        "sub-action": "loadcats"
      };
      this.ajax_token = "gestion_categories";
      this.trigger_request++;
    },
    ev_ajax_success(datas) {
      console.log("ev_ajax_success : ", datas);
      if (datas.return.loadcats) {
        this.buildTables(datas.return.loadcats);
      }
    },
    buildTables(rows) {
      console.log("rows : ", rows);
      this.table_rows = rows;
      this.table_headers = {
        id: {
          name: "id",
          label: "#id",
          perfom: []
        },
        label: {
          name: "label",
          label: "Label",
          perfom: []
        }
      };
    }
  }
};
</script>

<!--
    //siteweb/PluginsModules/stephane888/wbu-components/src/components/App/NutribeShopify/cmpts/ListCategories.vue
-->
