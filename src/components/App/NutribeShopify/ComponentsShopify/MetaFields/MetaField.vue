<template lang="html">
  <div>
    <strong>Liste de metafields</strong>
    <div class="table-responsive">
      <table :id="table_id"></table>
    </div>
  </div>
</template>

<script>
/**
 * Jquery doit etre definie (simulation);
 */
if (window.jQuery) {
  var $ = window.jQuery;
}
/**
 * moment simulation
 */
if (window.moment) {
  var moment = window.moment;
}
export default {
  name: "MetaField",
  props: {
    metaFields: {
      type: Array,
      required: true
    }
  },
  components: {
    //
  },
  data() {
    return {
      /**
       * Tables.
       */
      table_id: "table-datas-metafields",
      datatable: {}
    };
  },
  mounted() {
    this.buildTable();
  },
  watch: {
    metaFields: {
      deep: true,
      handler: function() {
        this.buildTable();
      }
    }
  },
  computed: {
    //
  },
  methods: {
    buildTable() {
      var self = this;
      if (this.datatable.rows) {
        this.datatable.destroy();
        $("#" + this.table_id).empty();
      }
      this.datatable = $("#" + this.table_id).DataTable({
        data: self.metaFields,
        //info: false,
        order: [[0, "desc"]],
        columns: [
          { data: "key", title: "Key" },
          { data: "value", title: "Valeur" },
          {
            data: "created_at",
            title: "Date de creation",
            render: function(data) {
              return moment(data).format("DD/MM/YYYY à HH:mm");
            },
            className: "created-at"
          },
          {
            data: "updated_at",
            title: "Date de MAJ",
            render: function(data) {
              return moment(data).format("DD/MM/YYYY à HH:mm");
            },
            className: "created-at"
          }
        ],
        language: {
          url: "//cdn.datatables.net/plug-ins/1.10.21/i18n/French.json"
        }
      });
    }
  }
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
