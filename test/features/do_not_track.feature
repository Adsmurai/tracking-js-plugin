Feature: Honouring doNotTrack browser settings
  In order to protect my own privacy
  As a web page visitor
  when I enable the doNotTrack settings
  then this library does not send tracking data to remote servers

  Background:
    # Nothing here... yet

  Scenario Outline: Single page view gets tracked
    Given I browse "<proto>://tracking-test.adsmurai.local"
    When I am on "/<page_file>"
      And I enable the doNotTrack feature
      And I launch a page view event
      And I take a snapshot of sent AJAX requests
    Then the browser has sent 0 requests

    Examples:
      | proto | page_file |
      | http  | a.html    |
      | https | a.html    |
      | http  | b.html    |
      | https | b.html    |
