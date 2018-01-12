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
    Then the browser sends a "POST" request to "https://tracking-api.adsmurai.local"

    Examples:
      | proto | page_file |
      | http  | a.html    |
      | https | a.html    |
      | http  | b.html    |
      | https | b.html    |
