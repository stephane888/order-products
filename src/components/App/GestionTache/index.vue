<template>
  <div class="container-fluid">
    <nav class="navbar navbar-expand-lg navbar-light bg-light mb-3">
      <a class="btn btn-link d-none" href="/">
        <i class="fas fa-arrow-left"></i> Retour</a
      >
      <div class="collapse navbar-collapse" id="navbarSupportedContent">
        <ul class="navbar-nav mr-auto">
          <li class="nav-item" @click="home_page">
            <router-link class="nav-link" to="/">Accueil</router-link>
          </li>
          <li class="nav-item">
            <router-link class="nav-link" to="/create-project"
              >Créer un projet</router-link
            >
          </li>
          <li class="nav-item d-none">
            <a class="nav-link" href="#">Statistiques</a>
          </li>
        </ul>
      </div>
    </nav>
    <ajax
      :numbre_request="trigger_request"
      :data="data_post"
      :token="ajax_token"
      :debug="false"
      :show_alert_msg="false"
      @ev_ajax_success="ev_ajax_success"
      @ev_ajax_error="ev_ajax_error"
    ></ajax>
    <router-view
      class="container-body"
      :projects="projects"
      :projects_cards="projects_cards"
      :crumb="crumb"
      :template_edit_is_runing="form_edit_is_runing"
      @ev_show_alert="ev_show_alert"
      @ev_show_alert_warning="ev_show_alert_warning"
      @ev_close_alert="ev_close_alert"
      @ev_index="ev_index"
      ref="router"
    ></router-view>
  </div>
</template>

<script>
var Vue = window.Vue;
var hljs = window.hljs;
// import highlight to format code by coedSnipedckeditor.
//import hljs from "/siteweb/PluginsModules/stephane888/wbu-components/node_modules/ckeditor/plugins/codesnippet/lib/highlight/highlight.pack.js";
Vue.prototype.$hljs = hljs;
//var hljs = window.hljs;
/**
 * Import module.
 */
import VueRouter from "vue-router";
import { BootstrapVue, IconsPlugin } from "bootstrap-vue";
import "bootstrap/dist/css/bootstrap.css";
import "bootstrap-vue/dist/bootstrap-vue.css";
import VueNativeNotification from "vue-native-notification";
import moment from "moment";
// Install BootstrapVue
Vue.use(BootstrapVue);
// Optionally install the BootstrapVue icon components plugin
Vue.use(IconsPlugin);
/**
 *
 */
Vue.use(VueNativeNotification, {
  requestOnNotify: true
});
/**
 * load configs.
 */
import load_configs from "./configs.js";
/**
 * definitions des constances vuejs.
 */
Vue.prototype.$moment = moment;

/**
 * import components.
 */
import ajax from "./Ajax.vue";
import CreateProject from "./pages/CreateProject.vue";
import Projects from "./pages/Projects.vue";
const routes = [
  { path: "/", component: Projects },
  { path: "/create-project", component: CreateProject }
];
const router = new VueRouter({
  routes
});

export default {
  name: "GestionTache",
  data() {
    return {
      /**
       * Ajax
       */
      trigger_request: 0,
      data_post: {},
      ajax_token: "",
      /**
       * alert
       */
      show_alert: false,
      class_alert: "alert-danger",
      alert_message: "",
      id_admin_local: false,
      /**
       *
       */
      databaseConfig: "",
      projects: [],
      project: {},
      projects_cards: [],
      crumb: [],
      form_edit_is_runing: false,
      VuePage: {},
      interval: "",
      increment_music: 1,
      timer_check: 120000,
      count: 0
    };
  },
  router,
  components: {
    ajax: ajax
  },
  mounted() {
    this.databaseConfig = load_configs.configs.databaseConfig;
    if (localStorage.getItem("project")) {
      //console.log("load project");
      this.project = JSON.parse(localStorage.getItem("project"));
      document.title = this.project.titre;
      this.load_project(this.project);
    } else {
      this.loadProject();
    }
    this.VuePage = this.$refs.router;
    //this.VerifieTachesTerminer();
    this.VerifieTachesTerminerPeriode();
    //code sniped ckeditor
    //this.$hljs.initHighlightingOnLoad();
  },
  methods: {
    makeToast(
      title,
      body,
      variant = "warning",
      append = false,
      autoHideDelay = 20000
    ) {
      this.toastCount++;
      this.$bvToast.toast(body, {
        title: title,
        autoHideDelay: autoHideDelay,
        appendToast: append,
        variant: variant,
        id: "my-toast"
      });
    },
    showToast(
      title,
      body,
      project,
      autoHideDelay = 20000,
      variant = "warning"
    ) {
      var self = this;
      // Use a shorter name for this.$createElement
      const elt = this.$createElement;
      // Increment the toast count
      this.count++;
      // Create the message
      const vNodesMsg = elt("p", { class: ["text-center", "mb-0"] }, [
        //elt("b-spinner", { props: { type: "grow", small: true } }),
        body,
        //elt("strong", "toast"),

        elt(
          "b-button",
          {
            props: { variant: "outline-primary", size: "sm" },
            on: {
              click: function() {
                self.load_project(project);
              }
            },
            scopedSlots: {
              default: ""
            }
          },
          ["Modifier"]
        ),

        `#${this.count} `
        //elt("b-spinner", { props: { type: "grow", small: true } })
      ]);
      // Create the title
      const vNodesTitle = elt(
        "div",
        { class: ["d-flex", "flex-grow-1", "align-items-baseline", "mr-2"] },
        [
          elt("strong", { class: "mr-2" }, title),
          elt("small", { class: "ml-auto text-italics" }, "Voir")
        ]
      );
      // Pass the VNodes as an array for message and title
      this.$bvToast.toast([vNodesMsg], {
        title: [vNodesTitle],
        solid: true,
        autoHideDelay: autoHideDelay,
        variant: variant
      });
    },
    LoaderContent(idcontent) {
      console.log("Clik ok sur LoaderContent", idcontent);
    },
    home_page() {
      localStorage.removeItem("project");
      this.loadProject();
    },
    ev_show_alert(datas) {
      this.show_alert = true;
      this.class_alert = datas.classe;
      this.alert_message = datas.title;
    },
    ev_close_alert() {
      this.show_alert = false;
      this.class_alert = "";
      this.alert_message = "";
    },
    alert_close_static() {
      this.ev_close_alert();
    },
    ev_show_alert_warning(msg) {
      var data = {
        classe: "alert-warning",
        title: msg
      };
      this.ev_show_alert(data);
    },
    ev_index(datas) {
      if (datas["add-project-form"]) {
        this.ajax_token = "insert-db-add-project";
        this.data_post = {
          databaseConfig: this.databaseConfig,
          inserts: [{ fields: datas["add-project-form"], table: "contents" }]
        };
        this.trigger_request++;
      } //
      else if (datas["create_tache"]) {
        this.ajax_token = "insert-db-add-tache";
        this.data_post = {
          databaseConfig: this.databaseConfig,
          datas: datas["create_tache"]
        };
        this.trigger_request++;
        this.form_edit_is_runing = true;
      } //
      else if (datas["update_tache"]) {
        this.ajax_token = "update-db-add-tache";
        this.data_post = {
          databaseConfig: this.databaseConfig,
          datas: datas["update_tache"]
        };
        this.trigger_request++;
        this.form_edit_is_runing = true;
      } //
      else if (datas["load_project"]) {
        this.project = datas["load_project"];
        this.load_project(this.project);
      } //
      else if (datas["confirm_delete"]) {
        this.ajax_token = "delete-db-add-tache";
        this.data_post = {
          databaseConfig: this.databaseConfig,
          datas: datas["confirm_delete"].datas
        };
        this.trigger_request++;
      } //
      else if (datas["create-update_style"]) {
        this.ajax_token = "create-update_style";
        this.data_post = {
          databaseConfig: this.databaseConfig,
          datas: datas["create-update_style"]
        };
        this.trigger_request++;
      } //
      else if (datas["create-update_ressources"]) {
        this.ajax_token = "create-update_ressources";
        this.data_post = {
          databaseConfig: this.databaseConfig,
          datas: datas["create-update_ressources"],
          idcontents: datas["idcontents"]
        };
        this.trigger_request++;
      } //
      else if (datas["create-update_timer"]) {
        this.ajax_token = "create-update_timer";
        this.data_post = {
          databaseConfig: this.databaseConfig,
          datas: datas["create-update_timer"],
          idcontents: datas["idcontents"]
        };
        this.trigger_request++;
      } //
      else if (datas["token"] == "loader_timer") {
        this.ajax_token = "create-update_timer";
        this.data_post = {
          databaseConfig: this.databaseConfig,
          idcontents: datas["idcontents"]
        };
        this.trigger_request++;
      }
    },
    reload_current_project() {
      //console.log("this.project : ", this.project);
      if (this.project && this.project.idcontents) {
        this.load_project(this.project);
      }
    },
    load_project(project) {
      //console.log("Chagement de prject");
      this.ajax_token = "load-project";
      this.data_post = {
        databaseConfig: this.databaseConfig,
        project: project
      };
      this.trigger_request++;
    },
    ev_ajax_success(datas) {
      var self = this;
      console.log("ev_ajax_success", datas);
      if (datas.return) {
        if (datas.return["select-project"]) {
          this.projects_cards = datas.return["select-project"];
          this.projects = datas.return["select-project"];
        } //
        else if (datas.return["load-project-cards"]) {
          this.projects = datas.return["load-project"];
          this.projects_cards = datas.return["load-project-cards"];
          datas.return["crumb"].reverse();
          this.crumb = datas.return["crumb"];
        } //
        else if (datas.return["insert-db-add-tache"]) {
          this.form_edit_is_runing = false;
          this.VuePage.close_modal();
          this.reload_current_project();
        } //
        else if (datas.token == "update-db-add-tache") {
          this.form_edit_is_runing = false;
          this.VuePage.close_modal();
          this.reload_current_project();
        } //
        else if (datas.return["delete-db-add-tache"]) {
          var result = datas.return["delete-db-add-tache"];
          this.VuePage.close_modal_delete();
          if (result.action) {
            console.log("Suppression du PROJECT");
            this.reload_current_project();
          } else {
            console.log("Impossible de supprimer");
          }
        } //
        else if (datas.return["create-update_style"]) {
          this.VuePage.close_modal_style();
          this.reload_current_project();
        } //
        else if (datas.token === "create-update_timer") {
          if (
            datas.return["create-update_timer"].PHP_execution_error ===
              undefined &&
            datas.return["create-update_timer"]
          ) {
            this.VuePage.timers = datas.return["create-update_timer"];
            this.VuePage.timer_date_debut = this.$moment(
              datas.return["create-update_timer"].timedebut
            ).format("YYYY-MM-DD");
            this.VuePage.timer_heure_debut = this.$moment(
              datas.return["create-update_timer"].timedebut
            ).format("HH:mm:ss");
          }
        } //
        else if (datas.token === "load_end_timer") {
          this.applyNotification(datas.return);
        } else {
          this.form_edit_is_runing = false;
        }
        //
        if (datas.token == "load-project") {
          //console.log("load-project...");
          /**
           * une foix le rendu effectuer on execute le formatge.
           */
          setTimeout(function() {
            self.$hljs.initHighlighting();
          }, 500);
        }
      } else {
        this.form_edit_is_runing = false;
      }
    },
    ev_ajax_error() {
      this.form_edit_is_runing = false;
    },
    loadProject(level = 0) {
      this.ajax_token = "select-project";
      this.data_post = {
        databaseConfig: this.databaseConfig,
        level: level
      };
      this.trigger_request++;
    },
    VerifieTachesTerminerPeriode() {
      var self = this;
      self.interval = setInterval(function() {
        self.VerifieTachesTerminer();
      }, self.timer_check);
    },
    VerifieTachesTerminer() {
      var self = this;
      self.ajax_token = "load_end_timer";
      self.data_post = {
        databaseConfig: self.databaseConfig
      };
      self.trigger_request++;
    },
    applyNotification(datas) {
      if (datas.load_end_timer_contents.length > 0) {
        // Affichage des messages
        for (const i in datas.load_end_timer_contents) {
          var titre = "Delai dépassé pour cette tache";
          var body = datas.load_end_timer_contents[i].project.titre;
          this.showToast(titre, body, datas.load_end_timer_contents[i].project);
        }
        // execution de l'audio.
        this.increment_music = 1;
        this.notifyAudio();
      }
    },
    notifyAudio() {
      var self = this;
      //this.$notification.requestPermission().then(console.log);
      var audio = new Audio(
        "/sons/salamisound-1532427-countdown-e-g-for-bomb-or.mp3"
      );
      audio.play();
      audio.addEventListener("ended", () => {
        //console.log("try play secod mudic", event);
        audio.src = "/sons/salamisound-2831616-gong-school-bell-hit-3.mp3";
        if (self.increment_music > 0) {
          audio.play();
          self.increment_music--;
        }
      });
    }
  }
};
</script>
<style lang="scss">
@import "scss/style.scss";
</style>

<!--
/siteweb/PluginsModules/stephane888/wbu-components/src/components/App/GestionTache/index.vue
-->
