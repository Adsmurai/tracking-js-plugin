Feature: Page View tracking
  In order to track page view events
  As a web page owner
  I want to track page views

  Background:
    # Nothing here... yet

  Scenario Outline: Single page view gets tracked
    Given I browse "<proto>://tracking-test.adsmurai.local"
    When I am on "/<page_file>"
      And I launch a page view event
      And I take a snapshot of sent AJAX requests
    Then the browser sends a "POST" request to "https://tracking-api.adsmurai.local/pageView"
      And the payload's "referrer" has value ""
      And the content type is set to "application/json"

    Examples:
      | proto | page_file |
      | http  | a.html    |
      | https | a.html    |
      | http  | b.html    |
      | https | b.html    |

  Scenario Outline: Referrer gets tracked
    Given I browse "https://<origin_host>"
      And I am on "<origin_path>"
      And I follow "a[href='<destination_path>']"
      And I launch a page view event
      And I take a snapshot of sent AJAX requests
    Then the payload's "referrer" has value "https://<origin_host><origin_path>"

    Examples:
      | origin_host                          | origin_path | destination_path |
      | tracking-test.adsmurai.local         | /           | /                |
      | tracking-test.adsmurai.local         | /           | /a.html          |
      | tracking-test.adsmurai.local         | /a.html     | /                |
      | tracking-test.adsmurai.local         | /a.html     | /b.html          |
      | tracking-test-bis.adsmurai.local     | /           | /                |
      | tracking-test-bis.adsmurai.local     | /           | /a.html          |
      | tracking-test-bis.adsmurai.local     | /a.html     | /                |
      | tracking-test-bis.adsmurai.local     | /a.html     | /b.html          |