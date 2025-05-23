function articleTemplate(data) {
  const { time, image, name, description } = data;
  function getInnerHtml() {
    return `<div class="card">
              <span class="position-absolute badge rounded-pill text-bg-warning">${time} min</span>
              <div class="card-header p-0">
                <img
                  class="card-img-top"
                  src="./assets/images/recettes/${image}"
                  alt="Card image cap"
                />
              </div>
              <div class="card-body fs-14">
                <h5 class="card-title my-3">${name}</h5>
                <p class="card-subtitle mt-4 mb-2 text-muted text-uppercase">
                  Recette
                </p>
                <p class="card-text">${description}</p>
                <p class="card-subtitle mt-4 mb-2 text-muted text-uppercase">Ingrédients</p>
                <div class="row ingredients-container"></div>
              </div>
            </div>`;
  }
  return { getInnerHtml };
}