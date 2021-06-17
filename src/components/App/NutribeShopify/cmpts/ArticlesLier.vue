<template>
  <div>
    <div class="form-group">
      <label>
        Selectionner l'article
      </label>
      <!-- <input class="form-control" type="text" v-model="filter_article" @click="load_article(1)"> -->
      <select class=" form-control" v-model="filter_article">
        <option
          v-for="(article, index) in formetad_select_articles"
          :value="index"
          v-html="article.title"
          :key="index"
        ></option>
      </select>
    </div>
    <!-- list de blogs -->
    <div class="lists-checkbox d-flex flex-wrap my-3">
      <div
        class="custom-control custom-checkbox"
        v-for="(blog, index) in blogs"
        :key="index"
      >
        <input
          type="checkbox"
          class="custom-control-input"
          :value="blog.id"
          :id="'cus475Check' + index"
          v-model="blogs_select"
        />
        <label
          class="custom-control-label"
          :for="'cus475Check' + index"
          v-html="blog.title"
        >
        </label>
      </div>
    </div>
    <!-- blog selectionné -->
    <div :id="id_html">
      <div
        v-for="(block, index) in articles_lier"
        class="drap-drop-box"
        :key="index"
      >
        <div class="d-flex justify-content-center align-items-center">
          <div class="identifiant text-center py-2">
            {{ index + 1 }}
            <i class="fas fa-arrows-alt fa-2x text-warning"></i>
          </div>
          <div class="w-100">
            <div class="form-group">
              <a
                :href="
                  'https://nutribe.fr/' +
                    block.blog_handle +
                    '/' +
                    block.handle_article
                "
                target="_blanck"
                v-html="block.title"
              >
              </a>
            </div>
            <span
              class="btn btn-outline-danger btn-sm remove-block"
              @click="remove_block(index)"
              ><i class="fas fa-trash-alt"></i
            ></span>
          </div>
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
    <pre class="d-none">
      {{ articles_lier }}
    </pre>
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
      /**
       * Variable pour gerer le type de blog
       */
      articles_lier: [],
      show_save: true,
      metafield_name: "articles_lier",
      filter_article: "",
      blogs_select: [],
      articles_lier_index: []
    };
  },
  computed: {
    formetad_select_articles: {
      get() {
        return this.buildSelectList();
      }
    }
  },
  watch: {
    blogs_select: {
      handler(val) {
        this.$emit("ev_index", {
          action: "update_select_blog",
          blogs_select: val
        });
      },
      deep: true
    },
    metafields: {
      handler() {
        this.PrepareBuildBloc();
      },
      deep: true
    },
    filter_article: function(index) {
      if (index !== "") {
        this.add_article(this.formetad_select_articles[index]);
      }
    }
  },
  methods: {
    remove_block(index) {
      if (this.articles_lier[index]) {
        for (const i in this.articles_lier_index) {
          if (this.articles_lier_index[i] === this.articles_lier[index].id) {
            this.articles_lier.splice(index, 1);
            this.articles_lier_index.splice(i, 1);
            break;
          }
        }
      }
    },
    PrepareBuildBloc() {
      if (this.article.id) {
        this.buildBloc();
      } else {
        alert("Error: le type d'entitté n'est pas pris en compte ");
      }
    },
    buildBloc() {
      this.articles_lier = [];
      this.articles_lier_index = [];
      //alert("");
      var nombreMetafield = this.metafields.length;
      if (nombreMetafield) {
        for (const i in this.metafields) {
          var metafield = this.metafields[i];
          if (metafield.key === this.metafield_name) {
            var val = JSON.parse(metafield.value);
            this.articles_lier = val;
            for (const j in val) {
              this.articles_lier_index.push(val[j].id);
            }
            break;
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
        value: this.articles_lier,
        type_metafield: "json_string",
        type: "article",
        id_entity: this.article.id,
        id_parent: this.article.blog_id
      });
    },
    set_value(val) {
      this.blogs_select = val;
    },
    buildSelectList() {
      var array_formated = [];

      for (const i in this.articles) {
        var article = this.articles[i];
        if (!this.articles_lier_index.includes(article.id)) {
          array_formated.push(article);
        }
      }
      return array_formated;
    },
    add_article(article) {
      //console.log("article", article);
      var self = this;
      var execution = function(blog_handle, article) {
        self.articles_lier.push({
          id: article.id,
          handle_article: article.handle,
          blog_handle: blog_handle,
          title: article.title
        });
        self.articles_lier_index.push(article.id);
      };
      for (const i in this.blogs) {
        if (article.blog_id == this.blogs[i].id) {
          execution(this.blogs[i].handle, article);
          this.add_sortable();
          break;
        }
      }
      this.filter_article = "";
    },
    add_sortable() {
      var self = this;
      var old_index, new_index;
      $("#" + this.id_html).sortable({
        axis: "y",
        cursor: "move",
        handle: ".identifiant",
        //containment: "parent",
        placeholder: "ui-state-highlight",
        //revert: true,
        start: function(event, ui) {
          if (event) {
            console.log("height : ", $(ui.item[0]).height());
            $(" .ui-state-highlight").height($(ui.item[0]).height());
            old_index = $(ui.item[0]).index();
          }
        },
        stop: function(event, ui) {
          if (event) {
            new_index = $(ui.item[0]).index();
            /**
             * Il faut desactiver avant de modofier le tableau.
             */
            $("#" + self.id_html).sortable("cancel");
            self.array_move(self.articles_lier, old_index, new_index);
            /*
            console.log(
              "old_index : ",
              old_index,
              "\n new_index : ",
              new_index
            );
            /**/
          }
        }
      });
    },
    array_move(arr, old_index, new_index) {
      while (old_index < 0) {
        old_index += arr.length;
      }
      while (new_index < 0) {
        new_index += arr.length;
      }
      if (new_index >= arr.length) {
        var k = new_index - arr.length + 1;
        while (k--) {
          arr.push(undefined);
        }
      }
      arr.splice(new_index, 0, arr.splice(old_index, 1)[0]);
    }
  }
};
</script>
<!--
/siteweb/PluginsModules/stephane888/wbu-components/src/components/App/NutribeShopify/cmpts/ArticlesLier.vue
-->
