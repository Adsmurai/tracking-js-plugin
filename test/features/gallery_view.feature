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
      And I launch a gallery view event
      And I am on "/b.html"
      And I launch a gallery view event
      And I take a snapshot of sent AJAX requests
    Then each request has a different "galleryId"


  Scenario: Requests are sent to the adecuate endpoint
    Given I browse "http://tracking-test.adsmurai.local"
    When I am on "/a.html"
      And I launch a gallery view event
      And I take a snapshot of sent AJAX requests
    Then the browser sends a "POST" request to "https://tracking-api.adsmurai.local/galleryView"
