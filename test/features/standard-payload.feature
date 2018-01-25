Feature: Standard payload
  In order to have a consistent record
  As a web page owner
  I want to event registration to behave uniformly across events

  Background:
    # Nothing here... yet

  Scenario Outline: Pristine window
    Given I browse "<proto>://tracking-test.adsmurai.local"
    When I am on "/<page_file>"
      And I launch a "test" event
      And I take a snapshot of sent AJAX requests
    Then  the payload's "trackingId" has value "dev-tracking-id"

    Examples:
      | proto | page_file |
      | http  | a.html    |
      | https | a.html    |
      | http  | b.html    |
      | https | b.html    |