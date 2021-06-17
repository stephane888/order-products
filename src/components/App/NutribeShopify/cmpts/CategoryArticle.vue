<template>
  <div>
    <ajax
      :numbre_request="trigger_request"
      :data="data_post"
      :token="ajax_token"
      :debug="false"
      :show_alert_msg="show_alert_msg"
      @ev_ajax_success="ev_ajax_success"
      @ev_ajax_error="ev_ajax_error"
    ></ajax>
    <div class="p-4 border mb-5 ">
      <div class="row">
        <div class="col-md-6">
          <!-- selectionner le blog -->
          <builder-forms
            :forms="forms_blog"
            @ev_builder_forms="ev_builder_forms_blog"
            :show_submit="false"
          ></builder-forms>
        </div>
      </div>
    </div>
    <div class="p-4 border mb-5 ">
      <tableau-gestion
        :show_id="true"
        :show_action="true"
        :class_table="'table-striped cat-article'"
        :rows="table_rows"
        :headers="table_headers"
        :empty_message="table_empty_message"
        :table_title="table_title"
        :show_title="table_show_title"
        :template_footer="table_template_footer"
        :datas_footer="table_datas_footer"
        :is_running="table_select_blog_is_running"
        :template_tableau_action="table_template_tableau_action"
        :template_edit="table_template_edit"
        :datas_ligne_edit="table_datas_ligne_edit"
        :template_edit_is_runing="table_template_edit_is_runing"
        @ev_action_ev_template_tableau_action="
          ev_action_ev_template_tableau_action
        "
        @ev_template_edit="ev_template_edit"
      ></tableau-gestion>
    </div>
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
import load_configs from "../configs.js";
const configs = load_configs;
import ajax from "/siteweb/PluginsModules/stephane888/wbu-components/src/components/App/NutribeShopify/Ajax.vue";
import TemplateCelluleCategory from "/siteweb/PluginsModules/stephane888/wbu-components/src/components/App/NutribeShopify/cmpts/TemplateCelluleCategory.vue";

/**
 * Contient les bouttons pour les actions au niveau de la cellule action
 */
import TemplateTableauAction from "/siteweb/PluginsModules/stephane888/wbu-components/src/components/Tableau/Elements/TemplateTableauAction.vue";

/**
 * Template pour gerer l'edition des données.
 */
import TableEeditDatas from "/siteweb/PluginsModules/stephane888/wbu-components/src/components/Tableau/Elements/EditRow.vue";

/**
 * Template pour gerer les données vides.
 */
const table_empty_categorie = {
  name: "TableEmptyCategorie",
  props: {
    datas: {
      type: [String, Boolean, Object, Array],
      default: "Vide"
    }
  },
  template: `<div v-html="datas" class="text-center"></div>`
};

export default {
  name: "CategoryArticle",
  data: function() {
    return {
      databaseConfig: "",
      /**
       * Ajax
       */
      trigger_request: 0,
      data_post: {},
      ajax_token: "",
      show_alert_msg: false,
      /**
       *table
       */
      table_rows: [],
      table_headers: {},
      table_empty_message: "Aucun article",
      table_show_title: false,
      table_title: "",
      table_datas_footer: "",
      table_select_blog_is_running: false,
      // Contient les buttons d'action dans la cellule action.
      table_template_tableau_action: TemplateTableauAction,
      //contient les données pour l'edition des données.
      table_datas_ligne_edit: {},
      // Contient le formulaire d'edition des données.
      table_template_edit: TableEeditDatas,
      table_template_edit_is_runing: false,
      /**
       * Formulaire pour la selection du blog.
       */
      forms_blog: [],

      /**
       * Contient tous les blogs( flux from shopify )
       */
      flux_blogs: [],
      /**
       * Contient tous les articles( flux from shopify )
       */
      flux_articles: [],
      /**
       * Contient le handle
       */
      blog_handle: "",
      /**
       * Contient le handle
       */
      article_handle: "",
      /**
       * Contient le blog selectionne par l'utilisateur.
       * @object
       */
      blog: {},
      /**
       * Contient l'article selectionné par l'utilisateur.
       */
      article: {},
      /**
       * Contient le flux de metafields du blog.
       */
      flux_blog_metafields: [],
      /**
       * Contient le flux de metafields de l'article.
       */
      flux_article_metafields: [],
      /**
       * Contient les données du metafield blog_category
       */
      blog_category: []
    };
  },
  components: {
    ajax: ajax
  },
  computed: {
    formated_blog_handle: {
      get() {
        return this.blog_handle;
      },
      set(val) {
        this.blog_handle = val;
        this.getIdBlogByHandle(val);
      }
    },
    formated_article_handle: {
      get() {
        return this.article_handle;
      },
      set(val) {
        this.article_handle = val;
        /**
         * on ne charge plus les metfields des articles.
         */
        //this.getIdArticleByHandle(val);
      }
    },
    table_template_footer: {
      get() {
        if (!this.table_rows.length && Object.keys(this.table_headers).length) {
          return table_empty_categorie;
        } else {
          return "";
        }
      }
    }
  },
  mounted() {
    console.log(" Chargement du module : CategoryArticle.vue ");
    this.databaseConfig = configs.databaseConfig;
    this.getBlogs();
  },
  methods: {
    ev_ajax_success(datas) {
      var self = this;
      console.log("ev_ajax_success : ", datas);
      /**
       * Chargement des blogs
       */
      if (
        datas.return &&
        datas.return.shopify_load_blog &&
        datas.return.shopify_load_blog.blogs
      ) {
        this.flux_blogs = datas.return.shopify_load_blog.blogs;
        this.buildLists(this.flux_blogs);
      } //
      else if (
        /**
         * Chargement des articles
         */
        datas.return &&
        datas.return.shopify_load_articles &&
        datas.return.shopify_load_articles.articles
      ) {
        this.table_select_blog_is_running = false;
        this.flux_articles = datas.return.shopify_load_articles.articles;
        this.buildLists(this.flux_articles, "articles");
        this.buildTableArticles(this.flux_articles);
      } //
      else if (
        datas.token === "shopify_load_articles_metafields" &&
        datas.return &&
        datas.return.shopify_load_articles_metafields &&
        datas.return.shopify_load_articles_metafields.articles
      ) {
        this.flux_article_metafields =
          datas.return.shopify_load_articles_metafields.metafields;
      } //
      else if (
        /**
         * Données brute de metafields (blog)
         */
        datas.return &&
        datas.return.shopify_load_blogs_metafields &&
        datas.return.shopify_load_blogs_metafields.metafields
      ) {
        this.flux_blog_metafields =
          datas.return.shopify_load_blogs_metafields.metafields;

        /**
         * on recupere un metafield en particulier.
         */

        var reseulKeySearch = async function() {
          /**
           * ####
           * Question importante, pourquoi c'est pas un promise qui est retounée ???
           */
          /**
           * On recupere la valeur et on met le contenu dans une variable (options select).
           */
          var result = await self.getMetafieldByKey("blog_categories");
          //console.log("1-result : ", result);
          if (result.value) {
            var val = JSON.parse(result.value);
            self.blog_category = val;
          } else if (result.then) {
            result.then(function(metafield) {
              var val = JSON.parse(metafield.value);
              self.blog_category = val;
            });
          } else {
            self.blog_category = [];
          }
        };
        reseulKeySearch();
        /**
         * On recupere les articles.
         */
        this.getArticlesBlogs(this.blog.id);
      } //
      else if (
        /**
         * Sauvegarde du metafield.
         */
        datas.return &&
        datas.return.save_metafields
      ) {
        this.form_add_cat_is_running = false;
        this.table_template_edit_is_runing = false;
        this.closeTemplateEdit();
      }
    },
    async getMetafieldByKey(key_search) {
      return new Promise(resolve => {
        if (this.flux_blog_metafields.length) {
          for (const i in this.flux_blog_metafields) {
            if (this.flux_blog_metafields[i].key === key_search) {
              resolve(this.flux_blog_metafields[i]);
            } else {
              var ii = i + 1;
              //console.log(this.flux_blog_metafields.length, "\n :", ii);
              if (this.flux_blog_metafields.length <= ii) {
                resolve(false);
              }
            }
          }
        } else {
          resolve(false);
        }
      });
    },
    ev_ajax_error(datas) {
      console.log("ev_ajax_error : ", datas);
      this.form_add_cat_is_running = false;
      this.table_select_blog_is_running = false;
      this.table_template_edit_is_runing = false;
    },
    /**
     * Selection d'un blog.
     */
    ev_builder_forms_blog(datas) {
      console.log("\n ev_builder_forms_blog : ", datas);
      /**
       * On recupere la liste des articles.
       */
      if (datas.blog_handle !== "") {
        this.formated_blog_handle = datas.blog_handle;
      } else {
        this.blog_handle = "";
      }
    },

    getBlogs() {
      this.show_alert_msg = false;
      this.data_post = {
        databaseConfig: this.databaseConfig
      };
      this.ajax_token = "shopify_load_blogs";
      this.trigger_request++;
    },
    buildTableArticles() {
      console.log("blog_category :: ", this.blog_category);
      var options = this.buildListCategories();
      this.table_rows = this.flux_articles;
      this.table_headers = {
        id: {
          name: "id",
          label: "ID article",
          addclass_td: {
            custom: "d-none"
          },
          edit: {
            template: "input-text",
            classe: "d-none"
          }
        },
        title: {
          name: "title",
          label: "Title",
          addclass_td: {
            custom: "titre"
          }
        },
        "metafield-categorie": {
          name: "metafield-categorie",
          label: "Categorie",
          edit: {
            template: "input-select",
            name: "metafield-categorie",
            options: options
          },
          addclass_td: {
            custom: "categorrie"
          },
          templates: {
            template_tableau_cellule: TemplateCelluleCategory
          }
        }
      };
    },
    buildListCategories() {
      var result = {};
      for (const i in this.blog_category) {
        result[this.blog_category[i].id] = this.blog_category[i].value;
      }
      return result;
    },
    buildLists(rows, type = "blogs") {
      var options = {};
      for (const i in rows) {
        options[rows[i].handle] = rows[i].title;
      }
      if (type == "blogs") {
        this.forms_blog = [
          {
            template: "input-select",
            input: {
              value: ""
            },
            label: "Selectionner le blog",
            name: "blog_handle",
            rules: "required",
            options: options,
            trigger: {
              submit: true
            }
          }
        ];
      }
    },
    getIdBlogByHandle(handle) {
      for (const i in this.flux_blogs) {
        if (this.flux_blogs[i].handle === handle) {
          this.blog = this.flux_blogs[i];
          this.getMetafieldsBlogs(this.blog.id);
          break;
        }
      }
    },
    getMetafieldsBlogs(id_blog) {
      this.show_alert_msg = false;
      this.data_post = {
        databaseConfig: this.databaseConfig,
        id_blog: id_blog
      };
      this.ajax_token = "shopify_load_blogs_metafields";
      this.trigger_request++;
    },
    getArticlesBlogs(id_blog) {
      this.table_select_blog_is_running = true;
      this.show_alert_msg = false;
      this.data_post = {
        databaseConfig: this.databaseConfig,
        id_blog: id_blog
      };
      this.ajax_token = "shopify_load_articles--category-article";
      this.trigger_request++;
    },
    getIdArticleByHandle(handle) {
      for (const i in this.flux_articles) {
        if (this.flux_articles[i].handle === handle) {
          this.article = this.flux_articles[i];
          this.getMetafieldsArticles(this.article.id);
          break;
        }
      }
    },
    getMetafieldsArticles(id_article) {
      this.show_alert_msg = false;
      this.data_post = {
        databaseConfig: this.databaseConfig,
        id_article: id_article,
        id_blog: this.blog.id
      };
      this.ajax_token = "shopify_load_articles_metafields";
      this.trigger_request++;
    },
    ev_action_ev_template_tableau_action(datas) {
      this.table_datas_ligne_edit = datas;
    },
    ev_template_edit(datas) {
      console.log("tableau ev_template_edit : ", datas);
      if (datas.action == "close") {
        this.closeTemplateEdit();
      } else if (datas.forms && datas.params) {
        this.table_template_edit_is_runing = true;

        if (datas.params.action == "save") {
          if (this.flux_articles[datas.forms.index]) {
            /**
             * On met à jour le tableau (l'affichage)
             */
            var value = this.flux_articles[datas.forms.index];
            value["metafield-categorie"] = datas.forms["metafield-categorie"];
            this.flux_articles[datas.forms.index] = value;
            /**
             * On ajoute l'id du produit dans l'attribut 'articles' de la categorie correspondate.
             */

            /**
             * On recupere l'attribut (articles) contenant les produits liées à la categorie.
             */
            var articles = [];
            for (const i in this.blog_category) {
              if (
                this.blog_category[i].id == datas.forms["metafield-categorie"]
              ) {
                articles = this.blog_category[i].articles;
              }
            }
            /**
             * On supprime l'id de produit s'il est deja attaché à une autre categorie.
             * ( doit etre en option )
             */

            // plus tard.

            /**
             * On ajoute l'id du produit selectionner dans la categorie selectionnée.
             */
            articles.push(datas.forms["id"]);
            console.log("this.blog_category final : ", this.blog_category);

            /**
             * On sauvegarde le metafield blog_categories
             */
            this.saveMetafieldblogCategory();
          }
        }
      }
    },
    /**
     * Cette action n'est plus utilisé.
     */
    saveMetafieldArticleCategory(id_article, val) {
      this.show_alert_msg = true;
      this.data_post = {
        databaseConfig: this.databaseConfig,
        metafields: {
          key: "categorie",
          value: val,
          type: "article",
          type_metafield: "string",
          id_entity: id_article,
          id_parent: this.blog.id
        }
      };
      this.ajax_token = "save_metafields";
      this.trigger_request++;
    },
    /**
     * Sauvegarde du metafield.
     */
    saveMetafieldblogCategory(provider = null) {
      this.show_alert_msg = true;
      this.data_post = {
        databaseConfig: this.databaseConfig,
        metafields: {
          key: "blog_categories",
          value: this.blog_category,
          type: "blog",
          id_entity: this.blog.id,
          type_metafield: "json_string"
        },
        provider: provider
      };
      this.ajax_token = "save_metafields";
      this.trigger_request++;
    },
    closeTemplateEdit() {
      $(".setting-edit")
        .css({
          "z-index": -10,
          backgroundColor: "none",
          opacity: 0
        })
        .addClass("d-none")
        .removeClass("d-flex");
    }
  }
};
</script>
<style lang="scss">
.cat-article.table {
  td.titre {
    width: 55%;
  }
}
</style>
<!--
/siteweb/PluginsModules/stephane888/wbu-components/src/components/App/NutribeShopify/cmpts/CategoryArticle.vue
-->
