<!--
  15/09/2020
    On ajoute un metafield (blog_categories_articles) qui doit contenir les informations sur les id articles qui sont ajoutes dans blog_categories[id_cat][articles].
    On doit pouvoir recuperer l'article à partir blog_categories_articles[blog_categories[id_cat][articles]]
  ****
  Ajouter sur la page http://mynutribe.kksa/shopify/?entity=blogs
  ce module fonctionne avec id du blog, qui peut etre forunir par le parent ou selectionner par ce dernier.
-->

<template>
  <div>
    <ajax
      :numbre_request="trigger_request"
      :data="data_post"
      :token="ajax_token"
      :debug="false"
      :show_alert_msg="show_alert_msg"
      :messages="ajax_messages"
      @ev_ajax_success="ev_ajax_success"
      @ev_ajax_error="ev_ajax_error"
    ></ajax>

    <!-- pour permetre la selection du bloc par le module -->
    <div v-if="!parent_init">
      <div
        class="custom-control custom-radio custom-control-inline"
        v-for="blog in blogs"
        :key="blog.id"
      >
        <input
          type="radio"
          :id="'id' + blog.id"
          v-model="id_blog"
          :value="blog.id"
          class="custom-control-input"
        />
        <label
          class="custom-control-label"
          :for="'id' + blog.id"
          v-html="blog.title"
        >
        </label>
      </div>
    </div>

    <component
      :actionparent="actionparent"
      :id_modal="formated_id_modal"
      v-bind:is="template_modal_body"
      :modal_body="modal_body"
      :titre_modal_preview="titre_modal"
      :customdatas1="blog_category"
      :customdatas3="template_edit_running"
      :modal_position="''"
      @ev_modal_simple="ev_modal_simple"
      ref="modal_simple"
    >
    </component>
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
import ModalSimple from "/siteweb/PluginsModules/stephane888/wbu-components/src/components/Modals/ModalSimple.vue";
import ajax from "/siteweb/PluginsModules/stephane888/wbu-components/src/components/App/NutribeShopify/Ajax.vue";
import load_configs from "../configs.js";
import GestionBlocs from "/siteweb/PluginsModules/stephane888/wbu-components/src/components/App/NutribeShopify/cmpts/GestionBlocs.vue";

export default {
  name: "GestionCats",
  props: {
    id_modal: {
      type: [String, Number]
    },
    blogs: {
      type: [Array]
    },
    parent_init: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      databaseConfig: "",
      titre_modal: "",
      template_edit_running: false,
      /**
       * Ajax
       */
      trigger_request: 0,
      data_post: {},
      ajax_token: "",
      show_alert_msg: false,
      ajax_messages: {
        msg: "",
        type: ""
      },
      //
      alert_trigger_show: 0,
      /**
       *
       */
      actionparent: "",
      template_modal_body: "",
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
       * Contient tous les articles( flux from shopify )
       */
      flux_articles: [],
      /**
       * Contient le flux de metafields du blog.
       */
      flux_blog_metafields: [],
      /**
       * Contient les données du metafield blog_categories
       */
      blog_category: [],
      /**
       * Contient les données provenant de l'ev_modal_simple
       */
      datas__ev_modal_simple: {},
      modal_body: {},
      /**
       * Permet d'acceder aux methodes et attribut de la vueGestionBlocs
       */
      VueGestionBlocs: {},
      id_blog: "",
      /**
       * Contient les informations sur les articles qui sont regoupés dans une categorie.
       */
      blog_categories_articles: {}
    };
  },
  mounted() {
    this.databaseConfig = load_configs.databaseConfig;
    /**
     * Certaisn composant en sont pas encore charger à ce niveau. on remplie this.VueGestionBlocs au niveau de open_modal.
     * ( Ceci est du à la logique de ce code, car ici on charger les autres composants apres l'ouverture du popup )
     * Le chargement de composant sa fait via this.template_modal_body = GestionBlocs;
     */
    this.template_modal_body = GestionBlocs;
  },
  watch: {
    id_blog: function(val) {
      this.open_modal(val);
    }
  },
  components: {
    "modal-simple": ModalSimple,
    ajax: ajax
  },
  computed: {
    formated_id_modal: {
      get() {
        return "model-" + this.id_modal;
      }
    }
  },
  methods: {
    set_blog_id(val) {
      this.id_blog = val;
    },
    open_modal(val = null) {
      var self = this;
      /**
       * On determine le template  à charger.
       */
      self.VueGestionBlocs = self.$refs.modal_simple;
      //console.log(self.$refs.modal_simple);
      self.VueGestionBlocs.set_loading_blocs(true);
      self.getBlog(val);
    },
    getBlog(val = null) {
      if (!val) {
        val = this.id_blog;
      }
      this.show_alert_msg = false;
      this.data_post = {
        databaseConfig: this.databaseConfig,
        id_blog: val
      };
      this.ajax_token = "shopify_load_blogs_with_metafield";
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
    ev_ajax_success(datas) {
      var self = this;
      console.log("ev_ajax_success : ", datas);
      /**
       * Chargement des blogs
       */
      if (
        datas.return &&
        datas.return.shopify_load_blog &&
        datas.return.shopify_load_blog.blog
      ) {
        //on reinitialise les valeurs du gestionnaire du blocs.
        this.blog_category = [];
        self.VueGestionBlocs.articles_attach = [];
        self.VueGestionBlocs.articles_select = [];
        //
        this.blog = datas.return.shopify_load_blog.blog;
        this.flux_blog_metafields = this.blog.metafields;
        this.titre_modal = "Blog : " + this.blog.title;
        self.VueGestionBlocs.set_loading_blocs(false);
        /**
         * On recupere un metafield en particulier.
         */
        self.buildDataForModal();
        var reseulKeySearch = async function() {
          /**
           * On recupere la valeur et on affiche les categories dans un tableau.
           */
          var result = await self.getMetafieldByKey("blog_categories");
          //console.log("reseulKeySearch : ", result);
          self.table_select_blog_is_running = false;
          if (result.value) {
            var val = JSON.parse(result.value);
            self.blog_category = val;
            self.add_sortable();
          }
        };
        reseulKeySearch();
        /**
         * On recupere les articles de la categorie
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
        if (datas.configs.provider) {
          if (datas.configs.provider == "add_categorie") {
            self.VueGestionBlocs.Vue_templatesubmitAdd.set_running(false);
            self.VueGestionBlocs.displayListsDatas();
          } else if (datas.configs.provider == "edit_categorie") {
            this.template_edit_running = false;
            self.VueGestionBlocs.displayListsDatas();
          } else if (datas.configs.provider == "confirm_delete") {
            self.VueGestionBlocs.active__table_template_edit_is_runing(false);
            self.VueGestionBlocs.Vue_tableau_gestion.$refs.cps_template_edit.close_modal();
          } else if (datas.configs.provider == "ordering") {
            self.VueGestionBlocs.template_ordering_is_runing = false;
          }
        }
        /**
         * Pour afficher les messages.
         */
        //self.VueGestionBlocs.show_alert__ajax_messages(self.ajax_messages);
      } //
      else if (
        /**
         * Chargement des articles
         */
        datas.return &&
        datas.return.shopify_load_articles &&
        datas.return.shopify_load_articles.articles
      ) {
        this.flux_articles = datas.return.shopify_load_articles.articles;
        self.VueGestionBlocs.set_flux_articles(this.flux_articles);
      }
    },
    ev_ajax_error() {
      var self = this;
      //on desactive toute les waitters.
      self.VueGestionBlocs.Vue_templatesubmitAdd.set_running(false);
      this.template_edit_running = false;
      self.VueGestionBlocs.active__table_template_edit_is_runing(false);
      self.VueGestionBlocs.template_ordering_is_runing = false;
    },
    getMetafieldByKey(key_search) {
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
    buildDataForModal() {
      this.modal_body = {
        table_headers: {
          value: {
            name: "value",
            label: "Valeur",
            edit: {
              template: "input-text"
            },
            addclass_tr: {
              custom: "drap-drop-box"
            }
          },
          id: {
            name: "id",
            label: "#id",
            edit: {
              template: "input-text",
              classe: "d-none"
            },
            addclass_td: {
              custom: "d-none"
            }
          }
        },
        alert: {}
      };
    },
    ev_modal_simple(valeurs) {
      console.log("ev_modal_simple : ", valeurs);
      var self = this;
      this.datas__ev_modal_simple = valeurs;
      /**
       * Edition des données
       */
      if (valeurs.form) {
        var datas = valeurs.form;
        if (datas.forms && datas.params) {
          this.table_template_edit_is_runing = true;
          this.template_edit_running = true;
          if (datas.params.action == "save") {
            if (this.blog_category[datas.forms.index]) {
              var value = this.blog_category[datas.forms.index];
              if (value.value) {
                value.value = datas.forms.value;
                if (datas.forms.id) {
                  value.id = datas.forms.id;
                }
              }
              this.blog_category[datas.forms.index] = value;
              this.saveMetafieldblogCategory("edit_categorie");
            }
          } else if (datas.params.action == "delete") {
            console.log("delete");
          }
        }
      } else if (valeurs.action === "confirm_delete") {
        /**
         * Suppresion d'une categorie
         */
        if (
          valeurs.row &&
          valeurs.row.action &&
          valeurs.row.action === "delete"
        ) {
          /**
           * Verification avant suppresion.
           */
          (async function() {
            var validation = await self.ValidBeforeDelete(valeurs.row.index);
            if (validation.status) {
              self.blog_category.splice(valeurs.row.index, 1);
              self.VueGestionBlocs.active__table_template_edit_is_runing(true);
              self.saveMetafieldblogCategory("confirm_delete");
            } else {
              self.VueGestionBlocs.ev_show_alert_warning(validation.msg);
              /**
               * On ferme le popup de confirmation;
               */
              self.VueGestionBlocs.close_modal_confirm();
            }
          })();
        }
      } else if (valeurs.action === "savemetafieldBlogCategory") {
        self.VueGestionBlocs.template_ordering_is_runing = true;
        self.saveMetafieldblogCategory("ordering");
      } //
      /**
       *  Ajout d'un nouveau terme dans le metafield.
       */
      else if (valeurs.form_add) {
        var traitement = function() {
          (function() {
            /**
             * On precise
             */
            self.form_add_cat_is_running = true;
            /**
             * On recupere le dernier identifiant;
             */
            var id = 1;
            if (self.blog_category.length) {
              id = self.blog_category.slice(-1)[0];
              if (id.id) {
                id = id.id + 1;
              }
            }
            var metafield = {
              id: id,
              value: valeurs.form_add.forms.categorie,
              articles: []
            };
            self.blog_category.push(metafield);
            self.VueGestionBlocs.Vue_templatesubmitAdd.set_running(true);
            self.saveMetafieldblogCategory("add_categorie");
          })();
        };

        var execution = function() {
          (async function() {
            /**
             * On verifie le terme
             */
            var validation = self.validationTerm(
              valeurs.form_add.forms.categorie
            );
            validation.then(function(data) {
              console.log("validation :", data);
              if (data.status) {
                /**
                 * Traitement;
                 */
                traitement();
              } else {
                // On affiche un message d'erreur.
                self.VueGestionBlocs.ev_show_alert_warning(data.msg);
              }
            });
          })();
        };
        execution();
      } //
      else if (valeurs.add_articles_in_categorie) {
        (function() {
          var article_id = parseInt(valeurs.add_articles_in_categorie.article);
          var index = valeurs.current_categorie_index;
          //var id = valeurs.current_categorie_id;
          if (self.blog_category[index]) {
            var n_value = self.blog_category[index];
            if (n_value.articles) {
              n_value.articles.push(article_id);
            } else {
              n_value.articles = [];
              n_value.articles.push(article_id);
            }
            self.blog_category[index] = n_value;
            /**
             * Reconstuire le blocs des associations.
             */
            self.VueGestionBlocs.get_list_articles_disponible();
            self.VueGestionBlocs.getListArticlesSelectionner();
          } else {
            //alert("error ...");
            self.VueGestionBlocs.ev_show_alert_warning("Error ...");
          }
        })();
      } //
      else if (valeurs.remove_articles_in_categorie) {
        (function() {
          var article_id = parseInt(
            valeurs.remove_articles_in_categorie.ligne.id
          );
          var index = valeurs.current_categorie_index;
          if (self.blog_category[index]) {
            var article_index = self.blog_category[index].articles.indexOf(
              article_id
            );
            self.blog_category[index].articles.splice(article_index, 1);
            /**
             * Reconstuire le blocs des associations.
             */
            self.VueGestionBlocs.get_list_articles_disponible();
            self.VueGestionBlocs.getListArticlesSelectionner();
          } else {
            self.VueGestionBlocs.ev_show_alert_warning("Error ...");
          }
        })();
      } //
      else if (valeurs.sortable === "article") {
        self.add_sortable_articles(valeurs);
      }
    },
    ValidBeforeDelete(index) {
      var self = this;
      return new Promise(resolve => {
        (async function() {
          var categorie = await self.categorieIsUse(index);
          if (categorie.status) {
            resolve({ status: true });
          } else {
            resolve(categorie);
          }
        })();
      });
    },
    categorieIsUse(index) {
      var self = this;
      return new Promise(resolve => {
        if (
          self.blog_category[index] &&
          self.blog_category[index].articles.length
        ) {
          resolve({
            status: false,
            msg: "Cette categorie est deja associée à des articles"
          });
        } else {
          resolve({ status: true });
        }
      });
    },
    validationTerm(val) {
      var self = this;
      return new Promise(resolve => {
        (async function() {
          var Doublon = await self.checkDoublonTerm(val);
          if (!Doublon.status) {
            resolve({ status: false, msg: Doublon.msg });
          }
          resolve({ status: true, msg: "" });
        })();
      });
    },
    checkDoublonTerm(val) {
      var self = this;
      return new Promise((resolve, reject) => {
        if (self.blog_category.length) {
          for (const i in self.blog_category) {
            if (self.blog_category[i].value === val) {
              resolve({ status: false, msg: "Le terme existe déjà" });
            }
            var ii = parseInt(i) + 1;
            if (self.blog_category.length <= ii) {
              resolve({ status: true, msg: "" });
            }
          }
        } else {
          resolve({ status: true, msg: "" });
        }

        /**
         * La fin du code s'execute en cas d'erreur.
         * (utile en dev)
         */
        //console.log("Error checkDoublonTerm");
        reject();
      });
    },
    /**
     * Sauvergarde des données.
     */
    saveMetafieldblogCategory(provider = null) {
      /**
       * On n'affiche plus les messages sur la page. (Les messages sont renvoyées sur le modal)
       */
      //this.show_alert_msg = true;
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
      // Apres cette action on MAJ le metafield "blog_categories_articles"
      this.BuildDatas__blog_categories_articles(this.blog_category);
    },
    BuildDatas__blog_categories_articles(blog_category) {
      var self = this;
      console.log("blog_category : ", blog_category);
      console.log("tous les articles : ", this.flux_articles);
      console.log("Le blog en cours : ", this.blog);
      this.blog_categories_articles = {};
      for (const i in blog_category) {
        var articles = blog_category[i].articles;
        for (const j in articles) {
          console.log("article : ", articles[j]);
          this.blog_categories_articles[articles[j]] = this.getArticle(
            articles[j]
          );
        }
      }

      setTimeout(function() {
        console.log(
          "this.blog_categories_articles : ",
          self.blog_categories_articles
        );
        self.saveMetafieldblog__blog_categories_articles();
      }, 400);
    },
    /**
     * Sauvergarde des données.
     */
    saveMetafieldblog__blog_categories_articles(provider = null) {
      this.data_post = {
        databaseConfig: this.databaseConfig,
        metafields: {
          key: "blog_categories_articles",
          value: this.blog_categories_articles,
          type: "blog",
          id_entity: this.blog.id,
          type_metafield: "json_string"
        },
        provider: provider
      };
      this.ajax_token = "save_metafields";
      this.trigger_request++;
    },
    getArticle(article_id) {
      var article = {};
      for (const i in this.flux_articles) {
        if (article_id == this.flux_articles[i].id) {
          article = {
            url: this.blog.handle + "/" + this.flux_articles[i].handle,
            handle: this.flux_articles[i].handle,
            handle_blog: this.blog.handle
          };
          break;
        }
      }
      return article;
    },
    add_sortable() {
      var self = this;
      var old_index, new_index;
      $(".array-liste-datas.categories tbody").sortable({
        axis: "y",
        cursor: "move",
        handle: ".identifiant",
        //revert: true,
        /*
        change: function(event, ui) {
          console.log("Position have change", event, ui);
        },
        /**/
        start: function(event, ui) {
          if (event) {
            old_index = $(ui.item[0]).index();
          }
        },
        stop: function(event, ui) {
          if (event) {
            new_index = ui.item[0].sectionRowIndex;
            /**
             * Il faut desactiver avant de modofier le tableau.
             */
            $(".array-liste-datas.categories tbody").sortable("cancel");
            self.array_move(self.blog_category, old_index, new_index);
          }
        }
      });
    },
    add_sortable_articles(valeurs) {
      var self = this;
      var old_index, new_index;
      var index = valeurs.current_categorie_index;
      $(".array-liste-datas.articles tbody").sortable({
        axis: "y",
        cursor: "move",
        handle: ".identifiant",
        //revert: true,
        /*
        change: function(event, ui) {
          console.log("Position have change", event, ui);
        },
        /**/
        start: function(event, ui) {
          if (event) {
            old_index = $(ui.item[0]).index();
          }
        },
        stop: function(event, ui) {
          if (event) {
            new_index = ui.item[0].sectionRowIndex;
            /**
             * Il faut desactiver avant de modofier le tableau.
             */
            $(".array-liste-datas.articles tbody").sortable("cancel");
            self.array_move(
              self.blog_category[index].articles,
              old_index,
              new_index
            );
            console.log("\n old_index", old_index, "\n new_index", new_index);
            console.log(
              "self.blog_category",
              self.blog_category[index].articles
            );
            self.VueGestionBlocs.getListArticlesSelectionner();
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

<style lang="scss"></style>
<!--
  /siteweb/PluginsModules/stephane888/wbu-components/src/components/App/NutribeShopify/cmpts/GestionCats.vue
-->
