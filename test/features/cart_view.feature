Feature: Cart view tracking
  In order to track user purchase habits
  As a web page owner
  I want to track cart views

  Background:
    # Nothing here... yet


  Scenario: Requests are sent with image related info
    Given I browse "http://tracking-test.adsmurai.local"
    When I am on "/a.html"
      And I launch a cart view event
      And I take a snapshot of sent AJAX requests
    Then the browser sends a "POST" request to "https://tracking-api.adsmurai.local/cartView"
