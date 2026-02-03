export function stela(md) {
  md.renderer.rules.image = (tokens, idx, options, env, self) => {
    const src = tokens[idx].attrGet("src");
    const alt = self.renderInlineAsText(tokens[idx].children, options, env);
    const imgClass = alt ? "img-wrap--wcap" : "img-wrap";

    if (alt) return `<span class="img-wrap"><img src="${src}"/></span><span class="img-wrap__cap" data-cap="${alt}"></span>`;

    return `<span class="img-wrap"><img src="${src}"/></span>`;
  }
}