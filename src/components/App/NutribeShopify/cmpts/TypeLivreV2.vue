<!--
    Version 02 [ Pas de developpment car cette fonctionnalités existe deja. elle est definit dans app#/manage-blog ]
    on va s'appuie sur ArticlesLier.vue.
    On ajoute le bloc  ci-dessous dans le metafield "blog_categories" au niveau du blog. Cela permet de d'afficher suivant un ordre bien precis et de charger facilement l'article.
    ...
    {
      "id": 384953057346,
      "handle_article": "eat-rich-live-long",
      "blog_handle": "livres",
      "title": "Eat rich, live long"
    },
    ...
    Le metafield "type_livre" n'est plus necessaire.

    Version 01
    Cette version permet d'attacher un article à une categorie. Mais elle sauvegarde l'id de la taxonomie dans le metafield "type_livre".
    Probleme en affichage, elle ne respecte pas l'odre d'affichage des articles.
-->
<template>
  <div>
    <div class="tab">
      <div class="w-100">
        <label>Type</label>
        <div class="lists-checkbox d-flex flex-wrap mt-2 mb-4">
          <div
            class="custom-control custom-checkbox"
            v-for="(blog, key) in blog_categories"
            :key="key"
          >
            <input
              type="checkbox"
              :id="'blog-' + camelToUnderscore(blog.value)"
              :value="blog.id"
              class="custom-control-input"
              v-model="blog_type"
            />
            <label
              class="custom-control-label"
              :for="'blog-' + camelToUnderscore(blog.value)"
              v-html="blog.value"
            ></label>
          </div>
        </div>
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
  </div>
</template>

<script>
export default {
  name: "TypeLivre",
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
      default: "type-livre"
    },
    blog: [Object, Array]
  },
  data() {
    return {
      /**
       * variable pour gerer le type de blog
       */
      blog_type: [],
      show_save: true,
      // metafield au niveau de l'article.
      metafield_name: "type_livre",
      // metafield au niveau du blog.
      metafield_name_blog: "blog_categories",
      //contient la liste des categories,
      blog_categories: [],
      blog_categories_ids: [],
      //
      current_tab: "",
      //
      metafields_blog: []
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
    PrepareBuildBloc() {
      if (this.article.id) {
        this.buildBloc();
        this.metafields_blog = this.blog.metafields;
        this.buildCategorie();
      } else {
        alert("Error: le type d'entitté n'est pas pris en compte ");
      }
    },
    buildBloc() {
      this.blog_type = [];
      //alert("");
      var val;
      var nombreMetafield = this.metafields.length;
      if (nombreMetafield) {
        for (const i in this.metafields) {
          var metafield = this.metafields[i];
          if (metafield.key === this.metafield_name) {
            val = JSON.parse(metafield.value);
            console.log("block type, ", val);
            this.blog_type = val;
            // on nettoie les valeurs.
          }
        }
      }
    },
    cleanValue() {
      for (const i in this.blog_type) {
        //last_array.splice(index, 1);
        if (!this.blog_categories_ids.includes(this.blog_type[i])) {
          this.blog_type.splice(i, 1);
        }

        /*
        for (const j in this.blog_categories) {
          if (this.blog_categories[j].id == this.blog_type[i]) {
            this.blog_type.splice(i, 1);
            break;
          }
        }
        /**/
      }
    },
    buildCategorie() {
      var val;
      for (const i in this.metafields_blog) {
        var metafield = this.metafields_blog[i];
        if (metafield.key === this.metafield_name_blog) {
          val = JSON.parse(metafield.value);
          if (val) {
            this.blog_categories = val;
            this.blog_categories_ids = [];
            for (const z in val) {
              this.blog_categories_ids.push(val[z].id);
            }
            this.cleanValue();
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
        value: this.blog_type,
        type_metafield: "json_string",
        type: "article",
        id_entity: this.article.id,
        id_parent: this.article.blog_id
      });
    },
    camelToUnderscore(key) {
      var result = key.replace(/([A-Z])/g, " $1");
      return result
        .split(" ")
        .join("-")
        .toLowerCase();
    }
  }
};
</script>

<!--
/siteweb/PluginsModules/stephane888/wbu-components/src/components/App/NutribeShopify/cmpts/TypeLivre.vue
-->
