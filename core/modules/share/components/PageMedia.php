<?php
/**
 * @file
 * PageMedia
 *
 * It contains the definition to:
 * @code
class PageMedia;
@endcode
 *
 * @author d.pavka
 * @copyright d.pavka@gmail.com
 *
 * @version 1.0.0
 */
namespace Energine\share\components;
use Energine\share\gears\AttachmentManager;
use Energine\share\gears\Field;
/**
 * Show media container on the page with attached to that page media files.
 *
 * @code
class PageMedia;
@endcode
 */
class PageMedia extends DataSet {
    /**
     * @copydoc DataSet::main
     */
    protected function main() {
        $this->prepare();

        //Поле добавлено чтобы Data не был пустым
        $this->getData()->addField(new Field('fake'));
        $m = new AttachmentManager(
            $this->getDataDescription(),
            $this->getData(),
            'share_sitemap'
        );
        $m->createFieldDescription();
        $m->createField('smap_id', false, $this->document->getID());
    }
}