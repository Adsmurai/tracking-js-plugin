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
    Then the payload's "trackingId" has value "dev-tracking-id"

    Examples:
      | proto | page_file |
      | http  | a.html    |
      | https | a.html    |
      | http  | b.html    |
      | https | b.html    |

  Scenario Outline: Pristine window
    Given I browse "<proto>://tracking-test.adsmurai.local"
    When I am on "/<page_file>"
      And I launch a "test" event
      And I take a snapshot of sent AJAX requests
    Then the payload's "url" has value "<proto>://tracking-test.adsmurai.local/<page_file>"

    Examples:
      | proto | page_file |
      | http  | a.html    |
      | https | a.html    |
      | http  | b.html    |
      | https | b.html    |

  Scenario Outline: Pristine window
    Given I browse "<proto>://tracking-test.adsmurai.local"
    When I am on "/<page_file>"
      And I launch a "test" event
      And I take a snapshot of sent AJAX requests
    Then the payload's "referrer" has value ""

    Examples:
      | proto | page_file |
      | http  | a.html    |
      | https | a.html    |
      | http  | b.html    |
      | https | b.html    |

  Scenario Outline: A link has been followed
    Given I browse "https://<origin_host>"
      And I am on "<origin_path>"
      And I follow "a[href='<destination_path>']"
      And I launch a "test" event
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