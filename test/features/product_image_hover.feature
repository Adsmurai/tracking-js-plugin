Feature: Product image hover tracking
  In order to have a better understanding of user behaviour
  As a web page owner
  I want to track hovered product images

  Background:
    # Nothing here... yet


  Scenario Outline: Requests are sent with product related info to productImageHove endpoint
    Given I browse "http://tracking-test.adsmurai.local"
    When I am on "/a.html"
      And I launch a product image hover event with payload containing '<eventData>'
      And I take a snapshot of sent AJAX requests
    Then the browser sends a "POST" request to "https://tracking-api.adsmurai.local/productImageHover"
      And the payload contains the eventData '<eventData>'

    Examples:
      | eventData                                                                                                      |
      | {"product": {"productId": "a product id", "price": {"amount": 42, "currencyISOCode": "an iso currency code"}}} |

  Scenario Outline: Requests are sent with product and image related info
    Given I browse "http://tracking-test.adsmurai.local"
    When I am on "/a.html"
      And I launch a product image hover event with payload containing '<eventData>'
      And I take a snapshot of sent AJAX requests
    Then the browser sends a "POST" request to "https://tracking-api.adsmurai.local/productImageHover"
      And the payload contains the eventData '<eventData>'

    Examples:
      | eventData                                                                                                                                                                                     |
      | {"product": {"productId": "a product id", "price": {"amount": 42, "currencyISOCode": "an iso currency code"}}, "ugcImage": {"imageId": "an image id", "position": 0, "gridX": 1, "gridY": 2}} |
