function ingredientCardTemplate(data) {
  const { ingredient, quantity, unit } = data;
  function getInnerHtml() {
    return  `<span class="fs-6 fw-bold">${ingredient}</span>
               <br />
            <span class="fs-6 text-black-50">${quantity} ${unit}</span>`;
  }
  return { getInnerHtml };
}