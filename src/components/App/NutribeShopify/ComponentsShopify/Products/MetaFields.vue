<!--
  Permet d'afficher les metafields de maniere  basique
-->
<template lang="html">
  <div :idproduct="productIdDisplay">
    <MetaField :meta-fields="metaFields"></MetaField>
  </div>
</template>

<script>
import Configs from "../../configs.js";
import MetaField from "../MetaFields/MetaField.vue";
export default {
  name: "MetaFields",
  props: {
    entity: {
      type: Object,
      required: true
    }
  },
  components: {
    MetaField
  },
  data() {
    return {
      metaFields: []
    };
  },
  mounted() {
    this.GetProductMetafield();
  },
  watch: {
    //
  },
  computed: {
    productIdDisplay() {
      this.GetProductMetafield();
      return this.productId;
    },
    productId() {
      return this.entity.id ? this.entity.id : 0;
    }
  },
  methods: {
    GetProductMetafield() {
      Configs.GetProductMetafield(this.productId).then(reponse => {
        this.metaFields = reponse;
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
