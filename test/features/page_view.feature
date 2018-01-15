Feature: Page View tracking
  In order to track page view events
  As a web page visitor
  I want that my page view gets tracked

  Background:
    # Nothing here... yet

  Scenario Outline: Single page view gets tracked
    Given I browse "<proto>://tracking-test.adsmurai.local"
    When I am on "/<page_file>"
      And I launch a page view event
      And I take a snapshot of sent AJAX requests
    Then the browser sends a "POST" request to "https://tracking-api.adsmurai.local/pageView"
      And the payload has property "pageViewId"
      And the payload's "url" has value "<proto>://tracking-test.adsmurai.local/<page_file>"

    Examples:
      | proto | page_file |
      | http  | a.html    |
      | https | a.html    |
      | http  | b.html    |
      | https | b.html    |


