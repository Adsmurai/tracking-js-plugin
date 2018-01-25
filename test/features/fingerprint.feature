Feature: Browser fingerprinting
  In order to track a user across different sessions
  As a web page owner
  I want identify users by means of a fingerprint

  Background:
    # Nothing here... yet

  Scenario Outline: The same fingerprint is sent regardless of page reload
    Given I browse "<proto>://tracking-test.adsmurai.local"
    When I am on "/<first_page_file>"
      And I launch a "test" event
      And I take a snapshot of sent AJAX requests
      And I am on "/<second_page_file>"
      And I launch a "test" event
      And I take a snapshot of sent AJAX requests
    Then all collected requests have the same fingerprint hash

    Examples:
      | proto | first_page_file | second_page_file |
      | http  | a.html          | a.html           |
      | http  | a.html          | b.html           |
