<template>
  <div>
    <div class="form-group">
      <label for="article_video">Contenu (video)</label>
      <textarea
        id="article_video"
        v-model="article_video"
        class="form-control"
        rows="12"
      ></textarea>
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
  name: "ArticleVideo",
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
      article_video: "",
      metafield_name: "article_video"
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
      this.article_video = "";
      //alert("");
      var nombreMetafield = this.metafields.length;
      if (nombreMetafield) {
        for (const i in this.metafields) {
          var metafield = this.metafields[i];
          if (metafield.key === this.metafield_name) {
            this.article_video = metafield.value;
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
        value: this.article_video,
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
/siteweb/PluginsModules/stephane888/wbu-components/src/components/App/NutribeShopify/cmpts/ArticleVideo.vue
-->
