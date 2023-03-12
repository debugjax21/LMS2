export default class ListView {
  constructor(storageSvc, options = {}) {
    this.storageSvc = storageSvc;
    this.options = options;
    console.log("List View Constructor");
    this.initView();
  }

  get $headerIcon() {
    return $(`#${this.storageSvc.sortCol}-${this.storageSvc.sortDir}`);
  }

  get $listContainer() {
    return $("#" + this.options.listContainerId);
  }

  get $alertContainer() {
    return $("#" + this.alertContainerId);
  }

  get alertContainerId() {
    return this.options.alertContainerId;
  }

  get $modal() {
    return $("#" + this.options.modalContainerId);
  }

  get entitySingle() {
    return this.options.entitySingle;
  }

  get $resetBtn() {
    return $("#" + this.options.resetBtnId);
  }

  get $continueBtnId() {
    return $("#" + this.options.continueBtnId);
  }

  async render() {
    let data = this.storageSvc.sort(
      this.storageSvc.sortCol,
      this.storageSvc.sortDir,
      true
    );
    console.log("view render");
    console.log(data);
    let html = `<table class="table table-hover">
            <thead>
                <tr>
                    <th class="table-header sortable" scope="col" data-col="name">Team Name
                        <i id="name-asc" class="fa fa-arrow-up" aria-hidden="true" style="display:none"></i>
                        <i id="name-desc" class="fa fa-arrow-down" aria-hidden="true" style="display:none"></i>
                    </th>
                    <th class="table-header sortable" scope="col" data-col="coachName">Coach Name
                        <i id="coachName-asc" class="fa fa-arrow-up" aria-hidden="true" style="display:none"></i>
                        <i id="coachName-desc" class="fa fa-arrow-down" aria-hidden="true" style="display:none"></i>                  
                    </th>
                    <th class="d-none d-md-table-cell table-header sortable" scope="col" data-col="coachPhone">Coach Phone
                        <i id="coachPhone-asc" class="fa fa-arrow-up" aria-hidden="true" style="display:none"></i>
                        <i id="coachPhone-desc" class="fa fa-arrow-down" aria-hidden="true" style="display:none"></i>  
                    </th>
                    <th class="d-none d-lg-table-cell table-header sortable" scope="col" data-col="numPlayers"># Players
                        <i id="numPlayers-asc" class="fa fa-arrow-up" aria-hidden="true" style="display:none"></i>
                        <i id="numPlayers-desc" class="fa fa-arrow-down" aria-hidden="true" style="display:none"></i>                    
                    </th>
                    <th class="table-header" scope="col">&nbsp;</th>
                </tr>
            </thead>
            <tbody>`;

    for (let row of data) {
      html += `<tr data-bs-toggle="popover" data-bs-html="true" data-placement="bottom"
                data-bs-content='<img class="d-block" src=${row.logo} width="40%"> 
                <p><span class="fw-bold">Team Name:</span> ${row.name}
                <br><span class="fw-bold">Coach:</span> ${row.coachName}
                <br><span class="fw-bold">Players:</span> ${row.players}</p>'
                data-bs-trigger="hover" data-bs-delay='300'>
                    <td scope="row">${row.name}</td>
                    <td>${row.coachName}</td>
                    <td class="d-none d-md-table-cell">${row.coachPhone}</td>
                    <td class="d-none d-lg-table-cell">${row.players.length}</td>
                    <td>
                        <button type="button" class="btn btn-warning d-inline-block m-xl-1 m-lg-0"><i class="fa-regular fa-pen-to-square"></i></button> 
                        <button type="button" class="btn btn-danger" data-bs-toggle="modal" data-bs-target="#${this.options.modalContainerId}" 
                        data-name="${row.name}" data-id="${row.id}"><i class="fa-solid fa-trash"></i></button>
                    </td>
                </tr>`;
    }

    html += `
            </tbody>
            </table>`;
    this.$listContainer.html(html);
    // Triggers sorting on header clicks
    this.bindTableHeaderTabs();
    // renders popovers on team hover.
    this.renderPopovers();
    // Triggers when trash button is selected.
    this.modalEvent();
  }

  bindTableHeaderTabs() {
    let that = this;
    $(".table-header").click(function (ev) {
      let dataName = $(this).attr("data-col");
      let curDirection = that.storageSvc.sortDir;

      if (dataName) {
        if (that.storageSvc.sortCol === dataName) {
          that.storageSvc.sortDir = curDirection == "asc" ? "desc" : "asc";
        } else {
          that.storageSvc.sortDir = "asc";
          that.storageSvc.sortCol = dataName;
        }

        that.render();
        that.renderPopovers();
      }
    });
    this.$headerIcon.show();
  }

  initView() {
    this.bindWrapperEvents();
  }

  bindWrapperEvents() {
    this.$resetBtn.click((e) => {
      this.storageSvc.reset();
      this.render();
      //Removes the alert message.
      $("#deletedTeamAlert").html("");
    });
  }

  renderPopovers() {
    var popoverTriggerList = [].slice.call($('[data-bs-toggle="popover"]'));
    popoverTriggerList.map(function (popoverTriggerEl) {
      return new bootstrap.Popover(popoverTriggerEl);
    });
  }

  modalEvent() {
    let that = this;
    // Manipulating the modal.
    $("#modal").on("show.bs.modal", function (ev) {
      let $btnTag = $(ev.relatedTarget);
      let teamName = $btnTag.attr("data-name");
      let $modalTitle = $(".modal-title");
      let teamId = $btnTag.attr("data-id");
      console.log(localStorage);

      $modalTitle.text(`Delete ${teamName}?`);

      // Handler for Continue button
      // storageSvc.delete() was being called twice
      // so .unbind('click') is called to fix it
      $("#continueBtn")
        .unbind("click")
        .click(function (ev) {
          $btnTag.closest("tr").remove();
          that.storageSvc.delete(teamId);
          // console.log(that.storageSvc);
          let alertHtml = `<div id="deleteAlert" class="alert alert-warning alert-dismissible fade show" role="alert">
        <strong>You deleted Team: ${teamName}</span>
        <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button></div>`;
          $("#deletedTeamAlert").html(alertHtml);
        });
    });
  }
}
