# Type & size scale — before/after (2026-08-18)

Every value below was originally transcribed **literally** from
`visual-direction-mockup.html`. That mockup's phone frame is `284 x 588` CSS px,
but a real device is ~390dp wide, so the literal values rendered ~30% small.

A first correction multiplied everything by ~1.4 (matching the mockup's *proportions*)
and overshot badly — "looks like my grandmother's phone". The values in the
**now** column are the second pass: anchored on readability (15dp body text)
rather than on the mockup frame.

**To revert to the original look, restore the "mockup" column.**

## app/(tabs)/index.tsx — Home

| style | mockup | now |
|---|---|---|
| `grid.gap`, `gridRow.gap` | 7 | 9 |
| `hero.paddingTop` / `paddingBottom` | 8 / 16 | 10 / 22 |
| `heroEyebrow.fontSize` / `marginBottom` | 11 / 8 | 11.5 / 10 |
| `heroCouple.fontSize` / `marginBottom` | 28 / 8 | 32 / 10 |
| `heroRule.width` / `marginBottom` | 28 / 8 | 34 / 12 |
| `heroDate.fontSize` | 13 | 15 |
| `divider.marginBottom` | 12 | 16 |
| `sectionLabel.fontSize` / `marginBottom` | 11 / 10 | 11.5 / 14 |
| `tile.height` / `borderRadius` / `padding` | 84 / 12 / 9 | 100 / 14 / 12 |
| `tileLabel.fontSize` | 13 | 15 |

## app/category/[id].tsx — category list

| style | mockup | now |
|---|---|---|
| `header.paddingBottom` | 12 | 16 |
| `headerTitle.fontSize` | 21 | 24 |
| `headerSub.fontSize` / `marginTop` | 11.5 / 2 | 13 / 4 |
| `list.paddingHorizontal` / `paddingBottom` | 16 / 16 | 20 / 20 |

`headerTop.height: 40`, `backBtn` 40x40 / `marginLeft: -6`, chevron 21 — **unchanged**.
These carry the settled back-button alignment convention shared with the vendor
hero; do not scale them.

## components/vendor-card.tsx

| style | mockup | now |
|---|---|---|
| `card.paddingVertical` | 10 | 12 |
| `photo.height` / `borderRadius` / `marginBottom` | 104 / 12 / 6 | 125 / 14 / 9 |
| `heartBtn` size / radius / top+right | 26 / 13 / 8 | 32 / 16 / 9 |
| heart icon | 15 | 17 |
| `vName.fontSize` / `paddingHorizontal` / `paddingBottom` | 15 / 10 / 8 | 18 / 12 / 9 |
| `metaRow.gap` | 6 | 8 |
| `vAddr.fontSize` | 12 | 14 |
| `vCap.fontSize` | 11 | 13 |

## app/vendor/[id].tsx — vendor profile

| style | mockup | now |
|---|---|---|
| `hero.height` | 190 | 230 |
| `body.paddingTop` | 16 | 20 |
| `name.fontSize` | 22 | 26 |
| `rule.width` / `marginTop` / `marginBottom` | 28 / 8 / 10 | 34 / 9 / 12 |
| `metaRow.gap` / `marginBottom` | 5 / 12 | 6 / 14 |
| people icon | 13 | 16 |
| `metaText.fontSize` | 11.5 | 14 |
| `desc.fontSize` / `lineHeight` / `marginBottom` | 12 / 19 / 16 | 15 / 23 / 18 |

`heroBtn` 40x40 / radius 30 / chevron 21 — **unchanged** (alignment convention).

Contact row (`contactRow`, `btn`, `btnSolid`, `btnOutline`, `btnText*`) was built
new at the current scale; the mockup equivalents were `padding:11px 0`,
`font-size:12.5px`, `border-radius:12px`, `gap:8px`.

## components/vendor-calendar.tsx

Built during the same session, so "mockup" here means the literal
`.cal-*` CSS values it was first written from.

| style | mockup | now |
|---|---|---|
| `calWrap.marginBottom` | 14 | 16 |
| `calHead.marginBottom` | 8 | 10 |
| `calLabel.fontSize` | 10 | 11.5 |
| `calNavBtn` size / radius, `calNav.gap` | 26 / 13, 4 | 32 / 16, 6 |
| nav chevrons | 15 | 17 |
| `calWeek.gap` / `marginBottom` | 3 / 3 | 4 / 5 |
| `calWeekday.fontSize` | 8.5 | 10.5 |
| `calGrid.gap` | 3 | 4 |
| `calCell.borderRadius` | 5 | 7 |
| `CELL` gap allowance | `- 18` (6x3) | `- 24` (6x4) |
| `calDay.fontSize` | 9.5 | 12 |
| `calLegend.gap` / `marginTop` | 5 / 6 | 7 / 9 |
| `calDot` size / radius | 7 / 2 | 9 / 3 |
| `calLegendText.fontSize` | 9.5 | 11.5 |

Note the mockup has **no** weekday row and **no** month-nav arrows — both were
added deliberately (36 months of navigation), so they have no mockup equivalent.
