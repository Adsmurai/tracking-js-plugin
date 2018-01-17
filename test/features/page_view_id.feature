Feature: PageViewId preservation
  In order to differentiate track actions from different page views
  As a web page owner
  I want to be able to relate events to page views

  Background:
    # Nothing here... yet

  Scenario Outline: Different events from same page view have the same pageViewId
    Given I browse "<proto>://tracking-test.adsmurai.local"
    When I am on "/<page_file>"
      And I launch a page view event
      And I launch a page view event
      And I take a snapshot of sent AJAX requests
    Then all collected requests have the same pageViewId

    Examples:
      | proto | page_file |
      | http  | a.html    |


  Scenario Outline: Events from different page views have different pageViewIds
    Given I browse "<proto>://tracking-test.adsmurai.local"
    When I am on "/<page_file>"
      And I launch a page view event
      And I take a snapshot of sent AJAX requests
      And I am on "/<page_file>"
      And I launch a page view event
      And I take a snapshot of sent AJAX requests
    Then each request has a different pageViewId

    Examples:
      | proto | page_file |
      | http  | a.html    |

