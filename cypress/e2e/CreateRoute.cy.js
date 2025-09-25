import { v4 as uuidv4 } from 'uuid';
import { selectors } from '../support/selectors';

const validUuid = uuidv4(); // generate ramdon UUID

function getTimestamp() {
  const now = new Date();
  const pad = (n, width = 2) => n.toString().padStart(width, '0');

  return (
    now.getFullYear().toString() +
    pad(now.getMonth() + 1) +
    pad(now.getDate()) +
    pad(now.getHours()) +
    pad(now.getMinutes()) +
    pad(now.getSeconds()) +
    pad(now.getMilliseconds(), 3) 
  );
}

function visitWithBaseUrl(path) {
  cy.fixture('testData').then(data => {
    cy.visit(`${data.baseUrl}${path}`);
  });
}

function generateNames(prefix = 'test') {
  const ts = Date.now();
  return {
    serviceName: `service-${prefix}-${ts}`,
    routeName: `route-${prefix}-${ts}`,
    tag: `tag-${prefix}-${ts}`
  };
}


describe('create service with route', () => {

  it('Create new Service with new route', () => {
    //open the service page
    visitWithBaseUrl('/default/services');
    const { serviceName, routeName, tag } = generateNames('case1');
    //click the add service page
    cy.get('a[href="/default/services/create"]').click();
    //input Full URL
    cy.get(selectors.serviceUrlInput).type('https://api.kong-emily.com/url2')
    //input service name
    cy.get(selectors.serviceNameInput).clear().type(serviceName)
    //click tag field
    cy.contains('Add tags').click()
    cy.get('[data-testid="gateway-service-tags-input"]').clear().type(tag)
    //submit the new service
    cy.get('[type="submit"]').click()
    //New service is created 
    cy.get('.alert-message').should('be.visible');

    //create new route under the service page
    cy.contains('button', 'Add a Route').click()
    //input the route name
    cy.get(selectors.routeNameInput).type(routeName)
    //input the tag 
    cy.get(selectors.routeTagsInput).type(tag)
    //input the path
    cy.get('[data-testid="route-form-paths-input-1"]').type('/api/v1')
    cy.get('.multiselect-icons-container').click()
    cy.get('.input-element-wrapper').should('be.visible');
    cy.get('button').contains('GET').click()
    cy.get('body').click(0, 0);  
    cy.get('[data-testid="route-form-hosts-input-1"]').type('host.com')
    cy.get('[data-testid="route-create-form-submit"]').click()
    //the route is created and the route displayed
    cy.get('.title').contains(serviceName);

 })


 it('Create new service with Manually specify URL', () => {
    visitWithBaseUrl('/default/services');
    const { serviceName, tag } = generateNames('case2');
    cy.get('a[href="/default/services/create"]').click();
    cy.get('.radio-label').eq(1).click();
    cy.get('[data-testid="gateway-service-host-input"]').type('api.test.kong')
    cy.get('[data-testid="gateway-service-path-input"]').type('/test')
    cy.get('[data-testid="gateway-service-port-input"]').type('90')
    cy.get(selectors.serviceNameInput).clear().type(serviceName)
    cy.contains('Add tags').click()
    cy.get('[data-testid="gateway-service-tags-input"]').clear().type(tag)
    cy.get('[type="submit"]').click()
    cy.get('.title').should('have.text', serviceName);


  })

 it('Create new service with advanced fields information', () => {
    visitWithBaseUrl('/default/services');
    const { serviceName, tag } = generateNames('case3');
    cy.get('a[href="/default/services/create"]').click();
    cy.get(selectors.serviceUrlInput).type('https://api.kong-emily.com/url2')
    cy.get('[data-testid="collapse-trigger-label"]').eq(0).click();
    cy.get('[data-testid="gateway-service-connTimeout-input"]').clear().type('80000')
    cy.get('[data-testid="gateway-service-tls-verify-checkbox"]').click()
    cy.get('[data-testid="gateway-service-tls-verify-true-option"]').click()
    cy.get(selectors.serviceNameInput).clear().type(serviceName)
    cy.contains('Add tags').click()
    cy.get('[data-testid="gateway-service-tags-input"]').clear().type(tag)
    cy.get('[type="submit"]').click()
    cy.get('.title').should('have.text', serviceName);
  })

 it('Create new route with advanced information', () => {
    visitWithBaseUrl('/default/routes');
    const { routeName, tag } = generateNames('case1');
    //create new route
    cy.get('[data-testid="toolbar-add-route"]').click()
    cy.get(selectors.routeNameInput).type(routeName)
    cy.get(selectors.routeTagsInput).type(tag)
    cy.get('[data-testid="route-form-config-type-advanced"]').click()
    cy.get('[data-testid="route-form-paths-input-1"]').type('/api/v3')
    cy.get('.expanded-selection-empty').click()
    cy.get('[data-testid="multiselect-dropdown-input"]').should('be.visible');
    cy.contains('button','POST').click()
    cy.get('body').click(0, 0);  
    cy.get('[data-testid="route-create-form-submit"]').click()
    cy.get('.title').should('have.text', routeName);
  })

})


describe('create service with invalid data', () => {

 it('Create new service with invalid full URL', () => {
    visitWithBaseUrl('/default/services');
    const timestamp = getTimestamp();
    cy.get('a[href="/default/services/create"]').click();
    cy.get(selectors.serviceUrlInput).type(timestamp)
    cy.get('.help-text')
    .contains('The URL must follow a valid format')
    .should('exist')
  })

 it('Create new service with existing service name', () => {
    visitWithBaseUrl('/default/services');
    const { serviceName, tag } = generateNames('case1');
    cy.get('a[href="/default/services/create"]').click();
    cy.get(selectors.serviceUrlInput).type('https://api.kong-emily.com/url2')
    cy.get(selectors.serviceNameInput).clear().type(serviceName)
    cy.contains('Add tags').click()
    cy.get('[data-testid="gateway-service-tags-input"]').clear().type(tag)
    cy.get('[type="submit"]').click()
    //create the new service again to use the same service name above
    visitWithBaseUrl('/default/services');
    cy.get('a[href="/default/services/create"]').click();
    cy.get(selectors.serviceUrlInput).type('https://api.kong-emily.com/url2')
    cy.get(selectors.serviceNameInput).clear().type(serviceName)
    cy.get('[type="submit"]').click()
    cy.get('.form-error-list li')
  .contains('UNIQUE violation detected on')
  .should('exist'); 
  })

  it('Create new service with invalid service name', () => {
    visitWithBaseUrl('/default/services');
    cy.get('a[href="/default/services/create"]').click();
    cy.get(selectors.serviceUrlInput).type('https://api.kong-emily.com/url2')
    cy.get(selectors.serviceNameInput).clear().type('new-service-@#')
    cy.get('.help-text')
    .contains('The name can be any string containing characters') 
    .should('exist')
  }) 

})



describe('Delete the Route', () => {

// Test case to verify disabling the service functionality
it('Delete the route', () => {
    // Navigate to the services page
     visitWithBaseUrl('/default/routes');
    
    // Find all elements with the data-testid "switch-control"
    cy.get('body').find('[data-testid="row-actions-dropdown-trigger"]').then($elements => {
        // Check if at least one element was found
        if ($elements.length > 0) {
            // If elements exist, click the first one
            $elements.first().click();
            
            // Confirm the disable action by clicking the confirmation button
            cy.contains('button', 'Delete').click();
            
            // Verify that the first switch control is now unchecked
           cy.get('span.prompt-confirmation-text, span.confirmation-text')
        .should('be.visible')
        .invoke('text')
        .then(txt => {
          const clean = txt.trim().replace(/"/g, '');
          cy.get('[data-testid="confirmation-input"]').clear().type(clean);
          cy.contains('button', 'Yes, delete').click();
        })

        } else {
            // If no elements were found, log a message and do nothing
            cy.log('No route needs to delete ');
        }
    });
});

})

describe('Create new Certificate', () => {

  it('Create new Certificate', () => {
    cy.visit('http://localhost:8002/default/certificates');
    cy.get('[data-testid="empty-state-action"]').click();
    //need time to find the key and Cert id
  })
})

describe('Disable service', () => {

// Test case to verify disabling the service functionality
it('disable the service', () => {
    // Navigate to the services page
    visitWithBaseUrl('/default/services');
    // Find all elements with the data-testid "switch-control"
    cy.get('body').find('[data-testid="switch-control"]').then($elements => {
        // Check if at least one element was found
        if ($elements.length > 0) {
            // If elements exist, click the first one
            $elements.first().click();
            
            // Confirm the disable action by clicking the confirmation button
    cy.get('[data-testid="modal-action-button"]').click();            
            // Verify that the first switch control is now unchecked
            cy.get('[data-testid="switch-control"]')
                .first() // Select the first matching element
                .should('have.attr', 'aria-checked', 'false'); // Assert it's unchecked
        } else {
            // If no elements were found, log a message and do nothing
            cy.log('No elements with [data-testid="switch-control"] found');
        }
    });
});

})