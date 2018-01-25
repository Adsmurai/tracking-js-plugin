Feature: PageViewId preservation
  In order to differentiate track actions from different page views
  As a web page owner
  I want to be able to relate events to page views

  Background:
    # Nothing here... yet

  Scenario: Different events from same page view have the same pageViewId
    Given I browse "http://tracking-test.adsmurai.local"
    When I am on "/a.html"
      And I launch a "test" event
      And I launch a "test" event
      And I take a snapshot of sent AJAX requests
    Then all collected requests have the same pageViewId


  Scenario: Events from different page views have different pageViewIds
    Given I browse "http://tracking-test.adsmurai.local"
    When I am on "/a.html"
      And I launch a "test" event
      And I take a snapshot of sent AJAX requests
      And I am on "/<page_file>"
      And I launch a "test" event
      And I take a snapshot of sent AJAX requests
    Then each request has a different "pageViewId"
