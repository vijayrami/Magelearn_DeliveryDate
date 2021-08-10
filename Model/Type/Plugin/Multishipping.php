<?php

namespace Magelearn\DeliveryDate\Model\Type\Plugin;

class Multishipping
{

    /**
     * @var \Magento\Framework\App\RequestInterface
     */
    protected $request;
    /**
     * @var \Magelearn\DeliveryDate\Model\DeliveryDateManager
     */
    private $delivery;

    public function __construct(
        \Magento\Framework\App\RequestInterface $request,
        \Magelearn\DeliveryDate\Model\DeliveryDateManager $delivery
    ) {
        $this->request = $request;
        $this->delivery = $delivery;
    }

    /**
     * Set shipping methods before event to capture the delivery dates
     * @param \Magento\Multishipping\Model\Checkout\Type\Multishipping $subject
     * @param $methods
     * @throws \Magento\Framework\Exception\LocalizedException
     */
    public function beforeSetShippingMethods(
        \Magento\Multishipping\Model\Checkout\Type\Multishipping $subject,
        $methods
    ) {
        $deliveryDates = $this->request->getParam('delivery_date');
        $quote = $subject->getQuote();
        $this->delivery->add($deliveryDates, $quote);
    }
}
