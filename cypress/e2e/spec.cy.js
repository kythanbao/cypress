const siteURL = 'https://theme-ride-demo.myshopify.com' //https://praise-store-theme.myshopify.com
const collectionURL = siteURL + '/collections/all'
const cartURL = siteURL + '/cart'
const addToCartText = 'Add to cart'
const checkoutButtonText = 'Check out'
const customHref = ''
const variantSelectors = 'variant-radios'
const variantFieldSetSelector = 'fieldset'

describe('Auto check purchase process for Shopify Store', () => {
  it('Visits site ' + collectionURL, () => {
    cy.visit(collectionURL)
    cy.wait(2000)

    // Get random product in collection all
    cy.get('main a').then($els => {
      let arrs = []
      $els.each(( index, $el) => {
        if ($el && $el.getAttribute('href') && $el.getAttribute('href').toString().includes('/products/')) {
          arrs.push($el)
        }
      })

      // get random Index
      let randomIndex = Math.floor(Math.random() * arrs.length)
      let randomHref = arrs[randomIndex].getAttribute('href')
      const locationOrigin = window.location.origin
      randomHref = randomHref.includes(locationOrigin) ? randomHref : locationOrigin + randomHref

      // Visit random product
      cy.visit(customHref ? customHref : randomHref)
      cy.wait(2000)

      // select random variant
      cy.get("body").then($body => {
        if ($body.find(variantSelectors).length > 0) {
          cy.get(variantSelectors)
              .find(variantFieldSetSelector)
              .each($item => {
                let randomIndex = 0
                cy.wrap($item).find('input')
                    .its('length')
                    .then(numRadios => {
                      randomIndex = Math.floor(Math.random() * numRadios)
                      cy.wrap($item)
                          .find('input')
                          .eq(randomIndex)
                          .check({force: true}).wait(1000)
                    })
              })
          cy.wait(2000)
        }
      })


      //Add to cart
      cy.contains(addToCartText).click()
      cy.wait(2000)

      // Visit Cart Page
      cy.visit(cartURL)
      cy.wait(2000)

      // Goto Checkout page
      cy.contains(checkoutButtonText).click({force: true})
    })
  })

})

