Feature: PageViewId preservation
  In order to track actions from same page view
  As a web page visitor
  I want that event from same page view can be identified

  Background:
    # Nothing here... yet

  Scenario Outline: Different events from same page view have same pageViewId
    Given I browse "<proto>://tracking-test.adsmurai.local"
    When I am on "/<page_file>"
      And I launch a page view event
      And I launch a page view event
      And I take a snapshot of sent AJAX requests
    Then all collected requests have the same pageViewId

    Examples:
      | proto | page_file |
      | http  | a.html    |


