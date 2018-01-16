Feature: Page View tracking
  In order to track a user across different sessions
  As a web page visitor
  I want to be uniquely identified by means of a fingerprint

  Background:
    # Nothing here... yet

  Scenario Outline: Single page view gets tracked with unique fingerprint
    Given I browse "<proto>://tracking-test.adsmurai.local"
    When I am on "/<page_file>"
      And I launch a page view event
      And I take a snapshot of sent AJAX requests
      And I am on "/<page_file>"
      And I launch a page view event
      And I take a snapshot of sent AJAX requests
    Then all requests collected have the same fingerprint hash

    Examples:
      | proto | page_file |
      | http  | a.html    |
