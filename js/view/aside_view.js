import asideData from "../model/aside_data.js";

export default class AsideView {
  renderDefaultAside() {
    for (const aside in asideData) {
      let html = `<h3 class="text-center mt-3">${asideData[aside].header}</h3>`;
      html += this.createEventCards(aside);
      $(`#${asideData[aside].id}`).html(html);
    }
  }

  createEventCards(side) {
    let html = "";
    for (let event of asideData[side].events) {
      html += `<div class="card aside-card text-white mt-5" style="width: 100%;">
            <h4 class="card-header">${event.name}</h4>
            <div class="card-body">
                <img src=${event.img} width="100%" class="mx-auto d-block rounded">
                <h5 class="card-footer">${event.dates}</h5>
            </div>
        </div>`;
    }
    html += "</div></div>";
    return html;
  }

  renderAccordionAside() {
    for (const side in asideData) {
      if (!$(`#${side.id}`).hasClass("accordion")) {
        let html = `
        <div class="accordion-item">
            <div class="accordion-header">
                <button class="accordion-button" type="button" data-bs-toggle="collapse" data-bs-target="#${asideData[side].eventId}"
                aria-expanded="false" aria-controls=${asideData[side].eventId}><h3 class="text-center">${asideData[side].header}</h3></button>
            </div>
            <div id=${asideData[side].eventId}>`;

        html += this.createEventCards(side);

        $(`#${asideData[side].id}`).addClass("accordion");
        $(`#${asideData[side].id}`).html(html);
      }
    }
  }
}
