export function stela(md) {
  md.renderer.rules.image = (tokens, idx, options, env, self) => {
    const src = tokens[idx].attrGet("src");
    const alt = self.renderInlineAsText(tokens[idx].children, options, env);

    if (alt) return `<span class="img-wrap"><span class="img-wrap__clip"><img src="${src}"/></span><span class="img-wrap__cap">${alt}</span></span>`;

    return `<span class="img-wrap"><span class="img-wrap__clip"><img src="${src}"/></span></span>`;
  }
}