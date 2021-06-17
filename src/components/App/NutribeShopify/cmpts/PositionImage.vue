<template>
  <div>
    <div class="form-group">
      <label for="blog-position_image">Position image</label>
      <select
        class=" form-control"
        v-model="position_image"
        id="blog-position_image"
      >
        <option value="bottom">Bottom</option>
        <option value="center">Center</option>
        <option value="top">Top</option>
      </select>
    </div>
    <div>
      <span
        class="btn btn-outline-success btn-sm"
        @click="save_reference"
        v-if="show_save"
      >
        Enregistrer <i v-if="form_running" class="fas fa-sync fa-spin "> </i>
      </span>
    </div>
  </div>
</template>

<script>
export default {
  name: "PositionImage",
  props: {
    article: {
      type: Object
    },
    metafields: {
      type: [Array, Object]
    },
    form_running: {
      type: Boolean
    },
    id_html: {
      type: String,
      default: "articles-lier"
    },
    articles: {
      type: Array
    },
    blogs: {
      type: Array
    }
  },
  data() {
    return {
      show_save: true,
      position_image: "bottom",
      metafield_name: "position_image"
    };
  },
  watch: {
    metafields: {
      handler() {
        this.PrepareBuildBloc();
      },
      deep: true
    }
  },
  methods: {
    remove_block(index) {
      this.blocks.splice(index, 1);
    },
    PrepareBuildBloc() {
      if (this.article.id) {
        this.buildBloc();
      } else {
        alert("Error: le type d'entitté n'est pas pris en compte ");
      }
    },
    buildBloc() {
      this.position_image = "";
      //alert("");
      var nombreMetafield = this.metafields.length;
      if (nombreMetafield) {
        for (const i in this.metafields) {
          var metafield = this.metafields[i];
          if (metafield.key === this.metafield_name) {
            this.position_image = metafield.value;
          }
        }
      }
    },
    /**
     * On tranmet les donnnées non encodes qui doivent etre encoder par le parent.
     * Cette etape ne serra plus necessaire si on utilise le type jaon_string.
     *
     */
    save_reference() {
      this.$emit("ev_index", {
        action: "save_metafield",
        key: this.metafield_name,
        value: this.position_image,
        type_metafield: "string",
        type: "article",
        id_entity: this.article.id,
        id_parent: this.article.blog_id
      });
    }
  }
};
</script>

<!--
/siteweb/PluginsModules/stephane888/wbu-components/src/components/App/NutribeShopify/cmpts/PositionImage.vue
-->
