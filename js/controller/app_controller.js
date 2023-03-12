import LocalStorageService from "../model/local_storage_service.js";
import teamData from "../model/team_data.js";
import ListView from "../view/list_view.js";
import AsideView from "../view/aside_view.js";

export default class AppController {
  constructor() {
    console.log("app controller constructor");
    // localStorage.clear();
    this.storageSvc = new LocalStorageService(teamData, "myteams");
    this.listView = new ListView(this.storageSvc, {
      listContainerId: "teamList",
      modalContainerId: "modal",
      alertContainerId: "deletedTeamAlert",
      entitySingle: "team",
      resetBtnId: "resetBtn",
      continueBtnId: "continueBtn",
    });
    this.asideView = new AsideView();

    this.render();
  }

  async render() {
    await this.listView.render();

    // renders the asides based on screen width
    $(document).ready(() => {
      if (window.innerWidth < 768) {
        this.asideView.renderAccordionAside();
      } else {
        this.asideView.renderDefaultAside();
      }
    });

    $(window).resize(() => {
      if (window.innerWidth < 768) {
        this.asideView.renderAccordionAside();
      } else {
        this.asideView.renderDefaultAside();
      }
    });
  }
}
