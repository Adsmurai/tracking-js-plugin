Feature: Browser fingerprinting
  In order to track a user across different sessions
  As a web page owner
  I want to be uniquely identified by means of a fingerprint

  Background:
    # Nothing here... yet

  Scenario Outline: The same fingerprint is sent regardless fo page reload
    Given I browse "<proto>://tracking-test.adsmurai.local"
    When I am on "/<page_file>"
      And I launch a page view event
      And I take a snapshot of sent AJAX requests
      And I am on "/<page_file>"
      And I launch a page view event
      And I take a snapshot of sent AJAX requests
    Then all collected requests have the same fingerprint hash

    Examples:
      | proto | page_file |
      | http  | a.html    |
