Feature: Purchase finished tracking
  In order to have a better understanding of user behaviour
  As a web page owner
  I want to track purchase finished events

  Background:
    # Nothing here... yet


  Scenario Outline: Requests are sent with product related info
    Given I browse "http://tracking-test.adsmurai.local"
    When I am on "/a.html"
      And I launch a finish purchase event with payload containing '<eventData>'
      And I take a snapshot of sent AJAX requests
    Then the browser sends a "POST" request to "https://tracking-api.adsmurai.local/finishPurchase"
      And the payload contains the eventData '<eventData>'

    Examples:
      | eventData                                                                                                                      |
      | {"products": [{"product": {"productId": "a product id", "price": {"amount": 42, "currencyISOCode": "an iso currency code"}}}]} |

