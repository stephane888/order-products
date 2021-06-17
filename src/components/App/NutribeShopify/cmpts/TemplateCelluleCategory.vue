<template>
  <div>
    {{ display_cellule }}
  </div>
</template>
<script>
export default {
  name: "TemplateCelluleCategory",
  props: {
    cellule: {
      type: [Number, String]
    },
    ligne: {
      type: [Object, Array]
    },
    headers: {
      type: [Object, Array, String, Number]
    },
    datas: {
      type: [Object, Array, String, Number]
    }
  },
  data() {
    return {
      metafieldKey: "category",
      /**
       * metafield selectionner par la boucle.
       */
      metafield: {}
    };
  },
  computed: {
    display_cellule: {
      get() {
        if (this.headers[this.cellule]) {
          //console.log("\n\n metafield article : ", this.ligne[this.cellule]);
          return this.getValueMetafield();
        } else {
          return "";
        }
      }
    }
  },
  methods: {
    getValueMetafield() {
      if (this.headers[this.cellule].edit.options) {
        return this.headers[this.cellule].edit.options[this.datas]
          ? this.headers[this.cellule].edit.options[this.datas]
          : "";
      } else {
        return this.datas;
      }
    }
  }
};
</script>
<!--
/siteweb/PluginsModules/stephane888/wbu-components/src/components/App/NutribeShopify/cmpts/TemplateCelluleCategory.vue
-->
