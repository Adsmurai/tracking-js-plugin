Feature: Image click tracking
  In order to have a better understanding of user behaviour
  As a web page owner
  I want to track hovered images

  Background:
    # Nothing here... yet

  Scenario: Requests are sent to the adequate endpoint
    Given I browse "http://tracking-test.adsmurai.local"
    When I am on "/a.html"
      And I launch an image hover event
      And I take a snapshot of sent AJAX requests
    Then the browser sends a "POST" request to "https://tracking-api.adsmurai.local/ugcImageHover"


  Scenario Outline: Requests are sent with image related info
    Given I browse "http://tracking-test.adsmurai.local"
    When I am on "/a.html"
      And I launch an image hover event with payload containing '<eventData>'
      And I take a snapshot of sent AJAX requests
    Then the payload contains the eventData '<eventData>'

    Examples:
      | eventData                                                                       |
      | {"ugcImage": {"imageId": "an image id", "position": 0, "gridX": 1, "gridY": 2}} |

