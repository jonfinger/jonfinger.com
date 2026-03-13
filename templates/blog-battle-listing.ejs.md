<%
const fallbackScene = {
  label: "OPEN SLOT",
  name: "Unknown Signal",
  quote: "Fresh notes can deploy before their rival sprite is rendered."
};
%>

::: {.list .grid .battle-card-list}

<% for (const item of items) {
const battleLabel = item["battle-label"] || fallbackScene.label;
const battleName = item["battle-name"] || fallbackScene.name;
const battleQuote = item["battle-quote"] || item["battle-hook"] || fallbackScene.quote;
const battleAlt = item["image-alt"] || `${battleName} battle sprite`;
const battleSlug = battleName.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
%>
::: {.g-col-1 <%= metadataAttrs(item) %>}

```{=html}
<a href="<%- item.path %>" class="battle-card quarto-grid-link no-external">
  <article class="battle-card__frame battle-card__frame--<%= battleSlug %>">
    <span class="visually-hidden listing-battle-label"><%= battleLabel %></span>
    <span class="visually-hidden listing-battle-name"><%= battleName %></span>
    <span class="visually-hidden listing-battle-quote"><%= battleQuote %></span>
    <div class="battle-card__scene">
      <div class="battle-card__arena-tag" aria-hidden="true"><%= battleLabel %></div>
      <div class="battle-card__status battle-card__status--foe" aria-hidden="true">
        <span class="battle-card__status-name"><%= battleName %></span>
        <span class="battle-card__status-bars">
          <span></span>
          <span></span>
          <span></span>
          <span></span>
        </span>
      </div>
      <div class="battle-card__status battle-card__status--trainer" aria-hidden="true">
        <span class="battle-card__status-name">Jon</span>
        <span class="battle-card__status-bars">
          <span></span>
          <span></span>
          <span></span>
        </span>
      </div>
      <div class="battle-card__foe">
        <span class="visually-hidden listing-image"><%= battleName %></span>
```
<% if (item.image) { %>
```{=html}
        <img loading="lazy" src="<%- item.image %>" class="battle-card__foe-img" alt="<%= battleAlt %>">
```
<% } else { %>
```{=html}
        <div class="battle-card__foe-fallback" aria-hidden="true"></div>
```
<% } %>
```{=html}
      </div>
      <div class="battle-card__trainer" aria-hidden="true">
        <div class="battle-card__trainer-sprite"></div>
      </div>
      <div class="battle-card__terrain" aria-hidden="true"></div>
      <div class="battle-card__hook" aria-hidden="true">
        <span class="battle-card__hook-label">Quote</span>
        <strong><%= battleQuote %></strong>
      </div>
    </div>
    <div class="battle-card__body">
      <div class="battle-card__meta">
```
<% if (item.date) { %>
<div class="battle-card__date listing-date"><%= item.date %></div>
<% } %>
```{=html}
      </div>
      <h3 class="no-anchor battle-card__title listing-title"><%= item.title %></h3>
    </div>
  </article>
</a>
```

:::
<% } %>

:::
