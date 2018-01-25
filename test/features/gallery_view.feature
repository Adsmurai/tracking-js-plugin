# TODO: Change the "As a" field
Feature: Gallery View tracking
  In order to track gallery view events
  As a web page owner
  I want to track gallery views

  Background:
    # Nothing here... yet

  Scenario: Different galleries send different ids
    Given I browse "http://tracking-test.adsmurai.local"
    When I am on "/a.html"
      And I launch a "test" event
      And I am on "/b.html"
      And I launch a "test" event
      And I take a snapshot of sent AJAX requests
    Then each request has a different "galleryId"


  Scenario: Requests are sent to the adecuate endpoint
    Given I browse "http://tracking-test.adsmurai.local"
    When I am on "/a.html"
      And I launch a gallery view event
      And I take a snapshot of sent AJAX requests
    Then the browser sends a "POST" request to "https://tracking-api.adsmurai.local/galleryView"


  Scenario Outline: Requests are sent with gallery related info
    Given I browse "http://tracking-test.adsmurai.local"
    When I am on "/a.html"
      And I launch a gallery view event with payload containing '<eventData>'
      And I take a snapshot of sent AJAX requests
    Then the payload contains the eventData '<eventData>'

    Examples:
      | eventData                                                                                             |
      | {"galleryGridWidth":42,"featuredImages":[]}                                                           |
      | {"galleryGridWidth":42,"featuredImages":[{"imageId":"an image id","position":0,"gridX":0,"gridY":0}]} |

